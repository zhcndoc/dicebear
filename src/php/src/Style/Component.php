<?php

declare(strict_types=1);

namespace DiceBear\Style;

class Component
{
    private ?ComponentTranslate $translate = null;
    /** @var array<string, ComponentVariant>|null */
    private ?array $variants = null;

    /** @param array<string, mixed> $data */
    public function __construct(private readonly array $data) {}

    public function width(): int|float
    {
        return $this->data['width'];
    }

    public function height(): int|float
    {
        return $this->data['height'];
    }

    public function probability(): int|float
    {
        return $this->data['probability'] ?? 100;
    }

    /** @return list<int|float> */
    public function rotate(): array
    {
        return $this->data['rotate'] ?? [];
    }

    public function translate(): ComponentTranslate
    {
        return $this->translate ??= new ComponentTranslate($this->data['translate'] ?? []);
    }

    /** @return array<string, ComponentVariant> */
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
