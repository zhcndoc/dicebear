<?php

declare(strict_types=1);

namespace DiceBear\Utils;

// @see https://www.regular-expressions.info/unicode.html
class Initials
{
    // Strips '@...' so email addresses yield a single initial instead
    // of being treated as two words.
    public static function fromSeed(string $seed, bool $discardAtSymbol = true): string
    {
        $input = $seed;

        if ($discardAtSymbol) {
            $input = preg_replace('/@.*/', '', $seed);
        }

        $input = preg_replace('/[`´\'ʼ]/', '', $input);

        if (!preg_match_all('/(\p{L}[\p{L}\p{M}]*)/u', $input, $matches)) {
            return $discardAtSymbol ? self::fromSeed($seed, false) : '';
        }

        $words = $matches[0];

        if (count($words) === 1) {
            if (preg_match('/^(?:\p{L}\p{M}*){1,2}/u', $words[0], $match)) {
                return mb_strtoupper($match[0]);
            }

            return '';
        }

        $first = null;
        $last = null;

        if (preg_match('/^(?:\p{L}\p{M}*)/u', $words[0], $match)) {
            $first = $match[0];
        }

        if (preg_match('/^(?:\p{L}\p{M}*)/u', $words[count($words) - 1], $match)) {
            $last = $match[0];
        }

        if ($first === null || $last === null) {
            return '';
        }

        return mb_strtoupper($first . $last);
    }
}
