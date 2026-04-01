<?php

declare(strict_types=1);

namespace DiceBear\Style;

class Meta
{
    private ?MetaLicense $license = null;
    private ?MetaCreator $creator = null;
    private ?MetaSource $source = null;

    /** @param array<string, mixed> $data */
    public function __construct(private readonly array $data) {}

    public function license(): MetaLicense
    {
        return $this->license ??= new MetaLicense($this->data['license'] ?? []);
    }

    public function creator(): MetaCreator
    {
        return $this->creator ??= new MetaCreator($this->data['creator'] ?? []);
    }

    public function source(): MetaSource
    {
        return $this->source ??= new MetaSource($this->data['source'] ?? []);
    }
}
