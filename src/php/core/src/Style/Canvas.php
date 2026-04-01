<?php

declare(strict_types=1);

namespace DiceBear\Style;

class Canvas
{
    /** @var list<Element>|null */
    private ?array $elements = null;

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

    /** @return list<Element> */
    public function elements(): array
    {
        return $this->elements ??= array_map(
            fn(array $el) => new Element($el),
            $this->data['elements'],
        );
    }
}
