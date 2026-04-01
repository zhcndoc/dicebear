<?php

declare(strict_types=1);

namespace DiceBear;

class OptionsDescriptor
{
    /** @var array<string, mixed> */
    private static array $rotateRange = ['type' => 'range', 'min' => -360, 'max' => 360];
    /** @var array<string, mixed> */
    private static array $translateRange = ['type' => 'range', 'min' => -100, 'max' => 100];

    /** @var array<string, mixed>|null */
    private ?array $descriptor = null;
    private Style $style;

    public function __construct(Style $style)
    {
        $this->style = $style;
    }

    /** @return array<string, mixed> */
    public function toJSON(): array
    {
        $this->descriptor ??= $this->build();

        return $this->descriptor;
    }

    /** @return array<string, mixed> */
    private function build(): array
    {
        $result = [
            'seed' => ['type' => 'string'],
            'size' => ['type' => 'number', 'min' => 1],
            'idRandomization' => ['type' => 'boolean'],
            'title' => ['type' => 'string'],
            'flip' => [
                'type' => 'enum',
                'values' => ['none', 'horizontal', 'vertical', 'both'],
                'list' => true,
            ],
            'fontFamily' => ['type' => 'string', 'list' => true],
            'fontWeight' => ['type' => 'number', 'min' => 1, 'max' => 1000, 'list' => true],
            'scale' => ['type' => 'range', 'min' => 0],
            'borderRadius' => ['type' => 'range', 'min' => 0, 'max' => 50],
            'rotate' => self::$rotateRange,
            'translateX' => self::$translateRange,
            'translateY' => self::$translateRange,
        ];

        foreach ($this->style->components() as $name => $component) {
            $variants = array_keys($component->variants());
            sort($variants);

            $result["{$name}Variant"] = [
                'type' => 'enum',
                'values' => $variants,
                'list' => true,
                'weighted' => true,
            ];
            $result["{$name}Probability"] = ['type' => 'number', 'min' => 0, 'max' => 100];
            $result["{$name}Rotate"] = self::$rotateRange;
            $result["{$name}TranslateX"] = self::$translateRange;
            $result["{$name}TranslateY"] = self::$translateRange;
        }

        $colorNames = array_merge(array_keys($this->style->colors()), ['background']);

        foreach ($colorNames as $name) {
            $result["{$name}Color"] = ['type' => 'color', 'list' => true];
            $result["{$name}ColorFill"] = [
                'type' => 'enum',
                'values' => ['solid', 'linear', 'radial'],
                'list' => true,
            ];
            $result["{$name}ColorFillStops"] = ['type' => 'range', 'min' => 1];
            $result["{$name}ColorAngle"] = self::$rotateRange;
        }

        return $result;
    }
}
