<?php

declare(strict_types=1);

namespace DiceBear\Utils;

class Color
{
    // Normalizes any hex format to 6- or 8-digit lowercase with '#' prefix.
    public static function toHex(string $hex): string
    {
        $normalized = strtolower(ltrim($hex, '#'));

        if (strlen($normalized) === 3) {
            return '#' . $normalized[0] . $normalized[0] . $normalized[1] . $normalized[1] . $normalized[2] . $normalized[2];
        }

        if (strlen($normalized) === 4) {
            return '#' . $normalized[0] . $normalized[0] . $normalized[1] . $normalized[1] . $normalized[2] . $normalized[2] . $normalized[3] . $normalized[3];
        }

        return '#' . $normalized;
    }

    // Like toHex, but strips the alpha channel to always return 6-digit hex.
    public static function toRgbHex(string $hex): string
    {
        $full = self::toHex($hex);

        return strlen($full) > 7 ? substr($full, 0, 7) : $full;
    }

    /** @return array{0: int, 1: int, 2: int} */
    public static function parseHex(string $hex): array
    {
        $digits = substr(self::toHex($hex), 1);

        return [
            intval(substr($digits, 0, 2), 16),
            intval(substr($digits, 2, 2), 16),
            intval(substr($digits, 4, 2), 16),
        ];
    }

    // WCAG 2.1 relative luminance with sRGB linearization.
    // https://www.w3.org/WAI/GL/wiki/Relative_luminance
    public static function luminance(string $hex): float
    {
        $rgb = self::parseHex($hex);
        $linearR = self::linearize($rgb[0]);
        $linearG = self::linearize($rgb[1]);
        $linearB = self::linearize($rgb[2]);

        return 0.2126 * $linearR + 0.7152 * $linearG + 0.0722 * $linearB;
    }

    // Returns a new array sorted by descending contrast against the reference color.
    // https://www.w3.org/WAI/GL/wiki/Contrast_ratio
    /** @param list<string> $candidates
     *  @return list<string> */
    public static function sortByContrast(array $candidates, string $refColor): array
    {
        $refLum = self::luminance($refColor);
        $withRatio = array_map(function (string $color) use ($refLum) {
            $lum = self::luminance($color);
            $ratio = (max($lum, $refLum) + 0.05) / (min($lum, $refLum) + 0.05);

            return ['color' => $color, 'ratio' => $ratio];
        }, $candidates);

        usort($withRatio, fn($a, $b) => $b['ratio'] <=> $a['ratio']);

        return array_map(fn($entry) => $entry['color'], $withRatio);
    }

    // Returns a new array with excluded colors removed.
    // Returns the original candidates if filtering would empty the list.
    /** @param list<string> $candidates
     *  @param list<string> $excluded
     *  @return list<string> */
    public static function filterNotEqualTo(array $candidates, array $excluded): array
    {
        $normalized = [];
        foreach ($excluded as $color) {
            $normalized[self::toRgbHex($color)] = true;
        }

        $filtered = array_values(array_filter(
            $candidates,
            fn(string $color) => !isset($normalized[self::toRgbHex($color)]),
        ));

        return count($filtered) > 0 ? $filtered : $candidates;
    }

    private static function linearize(int $channel): float
    {
        $srgb = $channel / 255;

        if ($srgb <= 0.04045) {
            return $srgb / 12.92;
        }

        return (($srgb + 0.055) / 1.055) ** 2.4;
    }
}
