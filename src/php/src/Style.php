<?php

declare(strict_types=1);

namespace DiceBear;

use DiceBear\Style\Canvas;
use DiceBear\Style\Color;
use DiceBear\Style\Component;
use DiceBear\Style\Meta;
use DiceBear\Validator\StyleValidator;

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

    public function id(): ?string
    {
        return $this->data['$id'] ?? null;
    }

    public function schema(): ?string
    {
        return $this->data['$schema'] ?? null;
    }

    public function comment(): ?string
    {
        return $this->data['$comment'] ?? null;
    }

    public function meta(): Meta
    {
        return $this->meta ??= new Meta($this->data['meta'] ?? []);
    }

    /** @return array<string, mixed> */
    public function attributes(): array
    {
        return $this->data['attributes'] ?? [];
    }

    public function canvas(): Canvas
    {
        return $this->canvas ??= new Canvas($this->data['canvas']);
    }

    /** @return array<string, Component> */
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

    /** @return array<string, Color> */
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
