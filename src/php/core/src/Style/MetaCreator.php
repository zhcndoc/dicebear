<?php

declare(strict_types=1);

namespace DiceBear\Style;

class MetaCreator
{
    /** @param array<string, mixed> $data */
    public function __construct(private readonly array $data) {}

    public function name(): ?string
    {
        return $this->data['name'] ?? null;
    }

    public function url(): ?string
    {
        return $this->data['url'] ?? null;
    }
}
