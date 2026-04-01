<?php

declare(strict_types=1);

namespace DiceBear\Utils;

class Xml
{
    private const ENTITIES = [
        '&' => '&amp;',
        "'" => '&apos;',
        '"' => '&quot;',
        '<' => '&lt;',
        '>' => '&gt;',
    ];

    public static function escape(string $value): string
    {
        return strtr($value, self::ENTITIES);
    }
}
