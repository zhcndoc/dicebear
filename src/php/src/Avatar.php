<?php

declare(strict_types=1);

namespace DiceBear;

class Avatar
{
    private string $svg;
    /** @var array<string, mixed> */
    private array $resolvedOptions;

    /** @param array<string, mixed> $options */
    public function __construct(mixed $style, array $options = [])
    {
        $resolvedStyle = $style instanceof Style ? $style : new Style($style);
        $resolvedOptions = new Options($resolvedStyle, $options);

        $this->svg = (new Renderer($resolvedStyle, $resolvedOptions))->render();
        $this->resolvedOptions = $resolvedOptions->resolved();
    }

    public function __toString(): string
    {
        return $this->svg;
    }

    public function toString(): string
    {
        return $this->svg;
    }

    /** @return array<string, mixed> */
    public function toJSON(): array
    {
        return [
            'svg' => $this->svg,
            'options' => $this->resolvedOptions,
        ];
    }

    public function toDataUri(): string
    {
        return 'data:image/svg+xml;charset=utf-8,' . rawurlencode($this->svg);
    }
}
