<?php

declare(strict_types=1);

namespace DiceBear\Style;

class Color
{
    /** @param array<string, mixed> $data */
    public function __construct(private readonly array $data) {}

    /** @return list<string> */
    public function values(): array
    {
        return $this->data['values'];
    }

    /** @return list<string> */
    public function notEqualTo(): array
    {
        return $this->data['notEqualTo'] ?? [];
    }

    public function contrastTo(): ?string
    {
        return $this->data['contrastTo'] ?? null;
    }
}
