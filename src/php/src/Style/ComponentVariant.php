<?php

declare(strict_types=1);

namespace DiceBear\Style;

class ComponentVariant
{
    /** @var list<Element>|null */
    private ?array $elements = null;

    /** @param array<string, mixed> $data */
    public function __construct(private readonly array $data) {}

    /** @return list<Element> */
    public function elements(): array
    {
        return $this->elements ??= array_map(
            fn(array $el) => new Element($el),
            $this->data['elements'],
        );
    }

    public function weight(): int|float
    {
        return $this->data['weight'] ?? 1;
    }
}
