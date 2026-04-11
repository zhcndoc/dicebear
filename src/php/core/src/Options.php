<?php

declare(strict_types=1);

namespace DiceBear;

use DiceBear\Error\CircularColorReferenceError;
use DiceBear\Utils\Color as ColorUtil;
use DiceBear\Validator\OptionsValidator;

class Options
{
    /** @var array<string, mixed> */
    private array $data;
    private Style $style;
    private Prng $prng;
    /** @var list<string> */
    private array $colorResolving = [];
    /** @var array<string, mixed> */
    private array $result = [];

    /** @param array<string, mixed> $data */
    public function __construct(Style $style, array $data)
    {
        OptionsValidator::validate($data);

        $this->data = $data;
        $this->style = $style;
        $this->prng = new Prng($this->seed());
    }

    public function seed(): string
    {
        return $this->memo('seed', fn() => $this->data['seed'] ?? '');
    }

    public function size(): ?int
    {
        return $this->memo('size', fn() => $this->data['size'] ?? null);
    }

    public function idRandomization(): bool
    {
        return $this->memo('idRandomization', fn() => $this->data['idRandomization'] ?? false);
    }

    public function title(): ?string
    {
        return $this->memo('title', fn() => $this->data['title'] ?? null);
    }

    public function flip(): string
    {
        return $this->memo(
            'flip',
            fn() => $this->prng->pick('flip', $this->toArray($this->data['flip'] ?? null)) ?? 'none',
        );
    }

    public function fontFamily(): string
    {
        return $this->memo(
            'fontFamily',
            fn() => $this->prng->pick('fontFamily', $this->toArray($this->data['fontFamily'] ?? null)) ?? 'system-ui',
        );
    }

    public function fontWeight(): int|float
    {
        return $this->memo(
            'fontWeight',
            fn() => $this->prng->pick('fontWeight', $this->toArray($this->data['fontWeight'] ?? null)) ?? 400,
        );
    }

    public function scale(): float
    {
        return $this->memo(
            'scale',
            fn() => $this->prng->float('scale', $this->toArray($this->data['scale'] ?? null)) ?? 1.0,
        );
    }

    public function borderRadius(): float
    {
        return $this->memo(
            'borderRadius',
            fn() => $this->prng->float('borderRadius', $this->toArray($this->data['borderRadius'] ?? null)) ?? 0.0,
        );
    }

    // Selects a variant for the given component. Depending on what was passed
    // as `${name}Variant` in the input data:
    // - null: PRNG picks from all style variants using their weights
    // - string or string[]: PRNG picks from the given subset (weight 1 each)
    // - assoc array: PRNG picks using the provided weights
    // Only variants that exist in the style definition are considered.
    public function variant(string $name): ?string
    {
        return $this->memo("{$name}Variant", function () use ($name) {
            if (!$this->isVisible($name)) {
                return null;
            }

            $components = $this->style->components();
            $component = $components[$name] ?? null;

            if ($component === null) {
                return null;
            }

            $raw = $this->get("{$name}Variant");
            $variants = $component->variants();

            if ($raw === null) {
                $entries = [];
                foreach ($variants as $v => $variant) {
                    $entries[] = [$v, $variant->weight()];
                }
            } elseif (is_string($raw) || array_is_list($raw)) {
                $arr = $this->toArray($raw);
                $entries = [];
                foreach ($arr as $v) {
                    if (isset($variants[$v])) {
                        $entries[] = [$v, 1];
                    }
                }
            } else {
                // Associative array with weights
                $entries = [];
                foreach ($raw as $v => $weight) {
                    if (isset($variants[$v])) {
                        $entries[] = [$v, $weight];
                    }
                }
            }

            return $this->prng->weightedPick("{$name}Variant", $entries);
        });
    }

    /** @return list<string> */
    public function color(string $name): array
    {
        return $this->memo("{$name}Color", fn() => $this->resolveColor($name));
    }

    public function colorFill(string $name): string
    {
        $key = "{$name}ColorFill";

        return $this->memo($key, function () use ($key) {
            $raw = $this->get($key);

            return $this->prng->pick($key, $this->toArray($raw)) ?? 'solid';
        });
    }

    public function colorAngle(string $name): float
    {
        $key = "{$name}ColorAngle";

        return $this->memo($key, function () use ($key) {
            $raw = $this->get($key);

            return $this->prng->float($key, $this->toArray($raw)) ?? 0.0;
        });
    }

    public function rotate(?string $name = null): float
    {
        return $this->numericComponentOption('rotate', $name, fn($c) => $c->rotate());
    }

    public function translateX(?string $name = null): float
    {
        return $this->numericComponentOption('translateX', $name, fn($c) => $c->translate()->x());
    }

    public function translateY(?string $name = null): float
    {
        return $this->numericComponentOption('translateY', $name, fn($c) => $c->translate()->y());
    }

    /** @return array<string, mixed> */
    public function resolved(): array
    {
        // Hide unset options (size, title) so the public shape matches the
        // JS reference, where these keys hold `undefined` and disappear on
        // JSON.stringify().
        return array_filter($this->result, static fn($v) => $v !== null);
    }

    private function numericComponentOption(string $option, ?string $name, callable $componentDefault): float
    {
        $key = $name !== null
            ? $name . strtoupper($option[0]) . substr($option, 1)
            : $option;

        return $this->memo($key, function () use ($key, $name, $componentDefault) {
            $raw = $this->get($key);

            if ($raw === null && $name !== null) {
                $components = $this->style->components();
                $component = $components[$name] ?? null;
                $values = $component !== null ? $componentDefault($component) : [];
            } else {
                $values = $this->toArray($raw);
            }

            return $this->prng->float($key, $values) ?? 0.0;
        });
    }

    private function probability(string $name): int|float
    {
        $raw = $this->get("{$name}Probability");

        if ($raw !== null) {
            return $raw;
        }

        $components = $this->style->components();

        return isset($components[$name]) ? $components[$name]->probability() : 100;
    }

    private function isVisible(string $name): bool
    {
        return $this->prng->bool("{$name}Probability", $this->probability($name));
    }

    private function colorFillStops(string $name): int
    {
        $raw = $this->get("{$name}ColorFillStops");
        $values = $this->toArray($raw);

        return $this->prng->integer("{$name}ColorFillStops", $values) ?? 2;
    }

    /** @return list<string> */
    private function resolveColor(string $name): array
    {
        $raw = $this->get("{$name}Color");
        $styleColors = $this->style->colors();
        $styleColor = $styleColors[$name] ?? null;

        if ($raw === null) {
            $source = $styleColor !== null ? $styleColor->values() : [];
        } else {
            $source = $this->toArray($raw);
        }

        $candidates = array_map(fn($c) => ColorUtil::toHex($c), $source);
        $fill = $this->colorFill($name);
        $stops = $fill === 'solid' ? 1 : $this->colorFillStops($name);

        if ($styleColor === null) {
            return array_slice($this->prng->shuffle("{$name}Color", $candidates), 0, $stops);
        }

        // Detect circular references (e.g. a.contrastTo = b, b.contrastTo = a)
        if (in_array($name, $this->colorResolving, true)) {
            throw new CircularColorReferenceError(array_merge($this->colorResolving, [$name]));
        }

        $this->colorResolving[] = $name;
        $contrastTo = $styleColor->contrastTo();
        $notEqualTo = $styleColor->notEqualTo();

        try {
            if ($contrastTo !== null) {
                $refColor = $this->color($contrastTo)[0] ?? null;

                if ($refColor !== null) {
                    $candidates = ColorUtil::sortByContrast($candidates, $refColor);
                }
            }

            if (count($notEqualTo) > 0) {
                $excluded = [];

                foreach ($notEqualTo as $ref) {
                    foreach ($this->color($ref) as $color) {
                        $excluded[] = $color;
                    }
                }

                $candidates = ColorUtil::filterNotEqualTo($candidates, $excluded);
            }
        } finally {
            array_pop($this->colorResolving);
        }

        // Skip shuffle when sorted by contrast to preserve the ordering
        $ordered = $contrastTo !== null
            ? $candidates
            : $this->prng->shuffle("{$name}Color", $candidates);

        return array_slice($ordered, 0, $stops);
    }

    private function get(string $key): mixed
    {
        return $this->data[$key] ?? null;
    }

    private function memo(string $key, callable $compute): mixed
    {
        if (array_key_exists($key, $this->result)) {
            return $this->result[$key];
        }

        $value = $compute();
        $this->result[$key] = $value;

        return $value;
    }

    /** @return list<mixed> */
    private function toArray(mixed $value): array
    {
        if ($value === null) {
            return [];
        }

        return is_array($value) ? $value : [$value];
    }
}
