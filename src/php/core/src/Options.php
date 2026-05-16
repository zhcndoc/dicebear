<?php

declare(strict_types=1);

namespace DiceBear;

use DiceBear\Validator\OptionsValidator;

/**
 * Validates the raw user-supplied options and exposes them through typed
 * accessors. Each accessor returns the user's input in a normalized form
 * (always a list for options that accept either a scalar or a list, or
 * `null` when the option is not set), so consumers — chiefly
 * {@see Resolver} — never have to do their own normalization.
 *
 * Resolution against the style definition and the PRNG happens in
 * {@see Resolver}; this class is purely about reading user input.
 */
class Options
{
    /** @var array<string, mixed> */
    private array $data;

    /**
     * @param array<string, mixed> $data
     */
    public function __construct(array $data = [])
    {
        OptionsValidator::validate($data);

        $this->data = $data;
    }

    public function seed(): ?string
    {
        return $this->data['seed'] ?? null;
    }

    public function size(): ?int
    {
        return $this->data['size'] ?? null;
    }

    public function idRandomization(): ?bool
    {
        return $this->data['idRandomization'] ?? null;
    }

    public function title(): ?string
    {
        return $this->data['title'] ?? null;
    }

    /** @return list<string> */
    public function flip(): array
    {
        return $this->asArray($this->data['flip'] ?? null);
    }

    /** @return list<string> */
    public function fontFamily(): array
    {
        return $this->asArray($this->data['fontFamily'] ?? null);
    }

    /** @return list<int|float> */
    public function fontWeight(): array
    {
        return $this->asArray($this->data['fontWeight'] ?? null);
    }

    /** @return array{min: int|float, max: int|float}|null */
    public function scale(): ?array
    {
        return $this->toRange($this->data['scale'] ?? null);
    }

    /** @return array{min: int|float, max: int|float}|null */
    public function borderRadius(): ?array
    {
        return $this->toRange($this->data['borderRadius'] ?? null);
    }

    /** @return array{min: int|float, max: int|float}|null */
    public function rotate(): ?array
    {
        return $this->toRange($this->data['rotate'] ?? null);
    }

    /** @return array{min: int|float, max: int|float}|null */
    public function translateX(): ?array
    {
        return $this->toRange($this->data['translateX'] ?? null);
    }

    /** @return array{min: int|float, max: int|float}|null */
    public function translateY(): ?array
    {
        return $this->toRange($this->data['translateY'] ?? null);
    }

    /**
     * Returns the user-set variant constraint for `$name`:
     * - `null` when the user did not set `${name}Variant`,
     * - `list<string>` when the user gave a string or string list,
     * - associative `array<string, int|float>` when the user gave a weighted map.
     *
     * @return list<string>|array<string, int|float>|null
     */
    public function componentVariant(string $name): ?array
    {
        $raw = $this->dynamic($name . 'Variant');

        if ($raw === null) {
            return null;
        }

        if (is_string($raw) || (is_array($raw) && array_is_list($raw))) {
            /** @var list<string> */
            return $this->asArray($raw);
        }

        /** @var array<string, int|float> */
        return $raw;
    }

    public function componentProbability(string $name): int|float|null
    {
        return $this->dynamic($name . 'Probability');
    }

    /**
     * Asymmetric on purpose: returns `null` (rather than `[]`) when
     * `${name}Color` is unset so the resolver can fall back to the style
     * definition's color values.
     *
     * @return list<string>|null
     */
    public function color(string $name): ?array
    {
        $raw = $this->dynamic($name . 'Color');

        return $raw === null ? null : $this->asArray($raw);
    }

    /** @return list<string> */
    public function colorFill(string $name): array
    {
        return $this->asArray($this->dynamic($name . 'ColorFill'));
    }

    /** @return array{min: int|float, max: int|float}|null */
    public function colorAngle(string $name): ?array
    {
        return $this->toRange($this->dynamic($name . 'ColorAngle'));
    }

    /** @return array{min: int|float, max: int|float}|null */
    public function colorFillStops(string $name): ?array
    {
        return $this->toRange($this->dynamic($name . 'ColorFillStops'));
    }

    /**
     * Returns the raw value of a dynamic-key option (e.g. `${name}Color`)
     * untouched. Used for keys that vary by component or color name.
     */
    private function dynamic(string $key): mixed
    {
        return $this->data[$key] ?? null;
    }

    /** @return list<mixed> */
    private function asArray(mixed $value): array
    {
        if ($value === null) {
            return [];
        }

        return is_array($value) ? $value : [$value];
    }

    /**
     * Normalizes a user-facing range option (bare number, `[min, max]`
     * 2-tuple, or `null`) into the internal range struct. A bare number
     * `n` becomes `['min' => n, 'max' => n]` — i.e. a fixed value.
     *
     * @return array{min: int|float, max: int|float}|null
     */
    private function toRange(mixed $value): ?array
    {
        if ($value === null) {
            return null;
        }

        if (is_int($value) || is_float($value)) {
            return ['min' => $value, 'max' => $value];
        }

        if (is_array($value) && array_is_list($value) && count($value) === 2) {
            return ['min' => $value[0], 'max' => $value[1]];
        }

        return null;
    }
}
