<?php

declare(strict_types=1);

namespace DiceBear\Style;

/**
 * Read-only view over a component's `translate` block, providing the X and Y
 * offset ranges.
 */
class ComponentTranslate
{
    /**
     * @param array<string, mixed> $data
     */
    public function __construct(private readonly array $data) {}

    /**
     * Returns the horizontal offset range, or an empty list when unset.
     *
     * @return list<int|float>
     */
    public function x(): array
    {
        return $this->data['x'] ?? [];
    }

    /**
     * Returns the vertical offset range, or an empty list when unset.
     *
     * @return list<int|float>
     */
    public function y(): array
    {
        return $this->data['y'] ?? [];
    }
}
