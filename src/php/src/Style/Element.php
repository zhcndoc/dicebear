<?php

declare(strict_types=1);

namespace DiceBear\Style;

class Element
{
    /** @var list<Element>|null */
    private ?array $children = null;

    /** @param array<string, mixed> $data */
    public function __construct(private readonly array $data) {}

    public function type(): string
    {
        return $this->data['type'];
    }

    public function name(): ?string
    {
        return $this->data['name'] ?? null;
    }

    /** @return string|array<string, mixed>|null */
    public function value(): string|array|null
    {
        return $this->data['value'] ?? null;
    }

    /** @return array<string, mixed>|null */
    public function attributes(): ?array
    {
        return $this->data['attributes'] ?? null;
    }

    /** @return list<Element> */
    public function children(): array
    {
        return $this->children ??= array_map(
            fn(array $child) => new Element($child),
            $this->data['children'] ?? [],
        );
    }
}
