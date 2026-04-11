<?php

declare(strict_types=1);

namespace DiceBear;

use DiceBear\Style\Canvas;
use DiceBear\Style\Color;
use DiceBear\Style\Component;
use DiceBear\Style\Meta;
use DiceBear\Validator\StyleValidator;

/**
 * Validated, lazily-decomposed wrapper around a style definition. Construction
 * runs the JSON Schema validator and stores a deep copy of the input so that
 * later mutation of the source object cannot leak into the rendered avatar.
 */
class Style
{
    /** @var array<string, mixed> */
    private array $data;
    private ?Meta $meta = null;
    private ?Canvas $canvas = null;
    /** @var array<string, Component>|null */
    private ?array $components = null;
    /** @var array<string, Color>|null */
    private ?array $colors = null;

    public function __construct(mixed $data)
    {
        StyleValidator::validate($data);

        $this->data = is_array($data) ? $data : json_decode(json_encode($data), true);
    }

    /**
     * Returns the definition's `$id`, or `null` when not set.
     */
    public function id(): ?string
    {
        return $this->data['$id'] ?? null;
    }

    /**
     * Returns the definition's `$schema` URI, or `null` when not set.
     */
    public function schema(): ?string
    {
        return $this->data['$schema'] ?? null;
    }

    /**
     * Returns the definition's `$comment`, or `null` when not set.
     */
    public function comment(): ?string
    {
        return $this->data['$comment'] ?? null;
    }

    /**
     * Returns the {@see Meta} view, lazily constructed on first access.
     */
    public function meta(): Meta
    {
        return $this->meta ??= new Meta($this->data['meta'] ?? []);
    }

    /**
     * Returns the root SVG attributes from the definition, defaulting to an
     * empty array.
     *
     * @return array<string, mixed>
     */
    public function attributes(): array
    {
        return $this->data['attributes'] ?? [];
    }

    /**
     * Returns the {@see Canvas} view, lazily constructed on first access.
     */
    public function canvas(): Canvas
    {
        return $this->canvas ??= new Canvas($this->data['canvas']);
    }

    /**
     * Returns a name → {@see Component} map for all defined components, built
     * lazily on first access.
     *
     * @return array<string, Component>
     */
    public function components(): array
    {
        if ($this->components === null) {
            $this->components = [];

            foreach ($this->data['components'] ?? [] as $name => $data) {
                $this->components[$name] = new Component($data);
            }
        }

        return $this->components;
    }

    /**
     * Returns a name → {@see Color} map for all defined colors, built lazily
     * on first access.
     *
     * @return array<string, Color>
     */
    public function colors(): array
    {
        if ($this->colors === null) {
            $this->colors = [];

            foreach ($this->data['colors'] ?? [] as $name => $data) {
                $this->colors[$name] = new Color($data);
            }
        }

        return $this->colors;
    }
}
