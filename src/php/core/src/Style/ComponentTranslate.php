<?php

declare(strict_types=1);

namespace DiceBear\Style;

class ComponentTranslate
{
    /** @param array<string, mixed> $data */
    public function __construct(private readonly array $data) {}

    /** @return list<int|float> */
    public function x(): array
    {
        return $this->data['x'] ?? [];
    }

    /** @return list<int|float> */
    public function y(): array
    {
        return $this->data['y'] ?? [];
    }
}
