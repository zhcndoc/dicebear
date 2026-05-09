<?php

declare(strict_types=1);

namespace DiceBear;

/**
 * Top-level entry point for rendering an avatar from a style and options.
 *
 * Construction immediately resolves and renders the SVG; the various
 * accessor methods return different serializations of that result.
 */
class Avatar
{
    private string $svg;
    /** @var array<string, mixed> */
    private array $resolvedOptions;

    /**
     * @param array<string, mixed> $optionsInput
     */
    public function __construct(mixed $styleInput, array $optionsInput = [])
    {
        $style = $styleInput instanceof Style ? $styleInput : new Style($styleInput);
        $options = new Options($optionsInput);
        $resolver = new Resolver($style, $options);

        $this->svg = (new Renderer($style, $resolver))->render();
        $this->resolvedOptions = $resolver->resolved();
    }

    public function __toString(): string
    {
        return $this->svg;
    }

    /**
     * Returns the rendered SVG markup.
     */
    public function toString(): string
    {
        return $this->svg;
    }

    /**
     * Returns the avatar as an associative array containing the SVG and the
     * fully resolved options used to render it.
     *
     * @return array<string, mixed>
     */
    public function toJSON(): array
    {
        return [
            'svg' => $this->svg,
            'options' => $this->resolvedOptions,
        ];
    }

    /**
     * Returns the SVG encoded as a `data:image/svg+xml` URI.
     */
    public function toDataUri(): string
    {
        return 'data:image/svg+xml;charset=utf-8,' . rawurlencode($this->svg);
    }
}
