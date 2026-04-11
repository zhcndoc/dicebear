<?php

declare(strict_types=1);

namespace DiceBear\Style;

/**
 * Read-only view over an entry in a style definition's `components` block.
 */
class Component
{
    private ?ComponentTranslate $translate = null;
    /** @var array<string, ComponentVariant>|null */
    private ?array $variants = null;

    /**
     * @param array<string, mixed> $data
     */
    public function __construct(private readonly array $data) {}

    /**
     * Returns the component's intrinsic width in canvas coordinates.
     */
    public function width(): int|float
    {
        return $this->data['width'];
    }

    /**
     * Returns the component's intrinsic height in canvas coordinates.
     */
    public function height(): int|float
    {
        return $this->data['height'];
    }

    /**
     * Returns the probability (0–100) that this component is rendered,
     * defaulting to 100 (always visible).
     */
    public function probability(): int|float
    {
        return $this->data['probability'] ?? 100;
    }

    /**
     * Returns the rotation range definition, or an empty list when the field
     * is unset.
     *
     * @return list<int|float>
     */
    public function rotate(): array
    {
        return $this->data['rotate'] ?? [];
    }

    /**
     * Returns the translate descriptor, defaulting to an empty object when
     * the style definition omits the field.
     */
    public function translate(): ComponentTranslate
    {
        return $this->translate ??= new ComponentTranslate($this->data['translate'] ?? []);
    }

    /**
     * Returns a name → {@see ComponentVariant} map for all defined variants,
     * built lazily on first access.
     *
     * @return array<string, ComponentVariant>
     */
    public function variants(): array
    {
        if ($this->variants === null) {
            $this->variants = [];

            foreach ($this->data['variants'] as $name => $data) {
                $this->variants[$name] = new ComponentVariant($data);
            }
        }

        return $this->variants;
    }
}
