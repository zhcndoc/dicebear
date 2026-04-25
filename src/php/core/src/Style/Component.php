<?php

declare(strict_types=1);

namespace DiceBear\Style;

/**
 * Read-only view over an entry in a style definition's `components` block.
 *
 * An entry is either a base component with its own dimensions and variants
 * or an alias declared via `extends`. Aliases inherit `width`, `height`,
 * and `variants` from the source component; per-instance overrides for
 * `probability`, `rotate`, `scale`, and `translate` fall through to the
 * source when omitted on the alias.
 */
class Component
{
    private ?ComponentTranslate $translate = null;
    /** @var array<string, ComponentVariant>|null */
    private ?array $variants = null;

    /**
     * @param array<string, mixed> $data
     */
    public function __construct(
        private readonly array $data,
        private readonly ?Component $source = null,
    ) {}

    /**
     * Returns the source component name when this entry is an alias, or
     * `null` for a base component.
     */
    public function extendsName(): ?string
    {
        return $this->data['extends'] ?? null;
    }

    /**
     * Returns the component's intrinsic width in canvas coordinates. For
     * aliases the source component's width is returned.
     */
    public function width(): int|float
    {
        return $this->source !== null ? $this->source->width() : $this->data['width'];
    }

    /**
     * Returns the component's intrinsic height in canvas coordinates. For
     * aliases the source component's height is returned.
     */
    public function height(): int|float
    {
        return $this->source !== null ? $this->source->height() : $this->data['height'];
    }

    /**
     * Returns the probability (0–100) that this component is rendered. Falls
     * back to the source component's probability for aliases when the alias
     * does not set its own override; defaults to 100 (always visible).
     */
    public function probability(): int|float
    {
        if (array_key_exists('probability', $this->data)) {
            return $this->data['probability'];
        }

        return $this->source !== null ? $this->source->probability() : 100;
    }

    /**
     * Returns the rotation range definition. Falls back to the source
     * component's range for aliases when the alias does not set its own
     * override; returns an empty list when neither is set.
     *
     * @return list<int|float>
     */
    public function rotate(): array
    {
        if (array_key_exists('rotate', $this->data)) {
            return $this->data['rotate'];
        }

        return $this->source !== null ? $this->source->rotate() : [];
    }

    /**
     * Returns the scale range definition. Falls back to the source
     * component's range for aliases when the alias does not set its own
     * override; returns an empty list when neither is set.
     *
     * @return list<int|float>
     */
    public function scale(): array
    {
        if (array_key_exists('scale', $this->data)) {
            return $this->data['scale'];
        }

        return $this->source !== null ? $this->source->scale() : [];
    }

    /**
     * Returns the translate descriptor. Falls back to the source component's
     * descriptor for aliases when the alias does not set its own override.
     */
    public function translate(): ComponentTranslate
    {
        if (array_key_exists('translate', $this->data)) {
            return $this->translate ??= new ComponentTranslate($this->data['translate']);
        }

        if ($this->source !== null) {
            return $this->source->translate();
        }

        return $this->translate ??= new ComponentTranslate([]);
    }

    /**
     * Returns a name → {@see ComponentVariant} map for all defined variants.
     * Aliases delegate to the source component's variants.
     *
     * @return array<string, ComponentVariant>
     */
    public function variants(): array
    {
        if ($this->source !== null) {
            return $this->source->variants();
        }

        if ($this->variants === null) {
            $this->variants = [];

            foreach ($this->data['variants'] as $name => $data) {
                $this->variants[$name] = new ComponentVariant($data);
            }
        }

        return $this->variants;
    }
}
