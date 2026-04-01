<?php

declare(strict_types=1);

namespace DiceBear\Prng;

// FNV-1a 32-bit hash.
// Offset basis: 0x811c9dc5, prime: 0x01000193.
// https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
class Fnv1a
{
    public static function hash(string $input): int
    {
        $hash = 0x811C9DC5;

        // FNV prime is small enough that hash * prime fits in 64-bit.
        foreach (self::utf16CodeUnits($input) as $code) {
            $hash = (($hash ^ $code) * 0x01000193) & 0xFFFFFFFF;
        }

        return $hash;
    }

    public static function hex(string $input): string
    {
        return str_pad(dechex(self::hash($input)), 8, '0', STR_PAD_LEFT);
    }

    // Converts a UTF-8 string to an array of UTF-16 code units,
    // matching JavaScript's charCodeAt() behavior.
    /** @return list<int> */
    private static function utf16CodeUnits(string $input): array
    {
        if ($input === '') {
            return [];
        }

        return array_values(unpack('v*', mb_convert_encoding($input, 'UTF-16LE', 'UTF-8')));
    }
}
