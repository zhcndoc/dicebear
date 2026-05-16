<?php

declare(strict_types=1);

namespace DiceBear;

use DiceBear\Prng\Fnv1a;
use DiceBear\Prng\Mulberry32;

/**
 * Key-based pseudorandom number generator.
 *
 * Each method takes a key that, combined with the seed, produces a
 * deterministic value. The same seed + key always yields the same result,
 * regardless of call order.
 */
class Prng
{
    private string $seed;

    public function __construct(string $seed)
    {
        $this->seed = $seed;
    }

    /**
     * Picks a single item from `$items` deterministically. Returns `null`
     * for an empty list. Duplicate values (by string representation) are
     * collapsed before picking so that input order and duplication do not
     * affect the result.
     *
     * @template T
     *
     * @param list<T> $items
     *
     * @return T|null
     */
    public function pick(string $key, array $items): mixed
    {
        if (count($items) === 0) {
            return null;
        }

        if (count($items) === 1) {
            return $items[0];
        }

        $unique = self::uniqueByCodePoint($items);

        if (count($unique) === 1) {
            return $unique[0];
        }

        $sorted = $unique;
        usort($sorted, self::compareByCodePoint(...));
        $index = (int) floor($this->getValue($key) * count($sorted));

        return $sorted[$index];
    }

    /**
     * Picks an item from `$entries` proportional to its weight. Duplicate
     * items (by string representation) are collapsed before picking — only
     * the first occurrence's weight is kept. When all weights are zero,
     * falls back to an unweighted {@see pick()}. Returns `null` for an
     * empty list.
     *
     * @param list<array{0: mixed, 1: int|float}> $entries
     */
    public function weightedPick(string $key, array $entries): mixed
    {
        if (count($entries) === 0) {
            return null;
        }

        if (count($entries) === 1) {
            return $entries[0][0];
        }

        $unique = self::uniqueByCodePoint($entries, fn($e) => (string) $e[0]);
        $sorted = $unique;
        usort($sorted, fn($a, $b) => self::compareByCodePoint($a[0], $b[0]));
        $totalWeight = (float) array_sum(array_column($sorted, 1));

        if ($totalWeight === 0.0) {
            return $this->pick($key, array_column($sorted, 0));
        }

        $threshold = $this->getValue($key) * $totalWeight;
        $cumulative = 0;

        foreach ($sorted as [$item, $weight]) {
            $cumulative += $weight;

            if ($threshold < $cumulative) {
                return $item;
            }
        }

        return $sorted[count($sorted) - 1][0];
    }

    /**
     * Returns `true` with the given probability (0–100, default 50).
     */
    public function bool(string $key, float $likelihood = 50): bool
    {
        return $this->getValue($key) * 100 < $likelihood;
    }

    /**
     * Returns a deterministic float in `$range`, rounded to four decimal
     * places. With `$range['step'] > 0`, the result is quantized to
     * `min + i*step` for the largest integer `i` that keeps the value within
     * the range. Non-positive or absent step means continuous. `min`/`max`
     * are sorted internally, so a reversed pair is tolerated.
     *
     * @param array{min: int|float, max: int|float, step?: int|float} $range
     */
    public function float(string $key, array $range): float
    {
        $min = min($range['min'], $range['max']);
        $max = max($range['min'], $range['max']);
        $step = $range['step'] ?? 0;
        $raw = $min + $this->getValue($key) * ($max - $min);
        $quantized = $step > 0
            ? $min + floor(($raw - $min) / $step) * $step
            : $raw;

        return round($quantized * 10000) / 10000;
    }

    /**
     * Returns a deterministic integer in `$range`. `min`/`max` are sorted
     * internally, so a reversed pair is tolerated. `$range['step']` is
     * accepted for symmetry with {@see float()} but ignored.
     *
     * @param array{min: int|float, max: int|float, step?: int|float} $range
     */
    public function integer(string $key, array $range): int
    {
        $min = (int) min($range['min'], $range['max']);
        $max = (int) max($range['min'], $range['max']);

        return (int) floor($this->getValue($key) * ($max - $min + 1)) + $min;
    }

    /**
     * Fisher-Yates shuffle with chained Mulberry32 state. Duplicate values
     * (by string representation) are collapsed before shuffling, so a
     * caller's slice off the front cannot accidentally produce a repeated
     * value.
     *
     * @template T
     *
     * @param list<T> $items
     *
     * @return list<T>
     */
    public function shuffle(string $key, array $items): array
    {
        if (count($items) <= 1) {
            return $items;
        }

        $result = self::uniqueByCodePoint($items);
        usort($result, self::compareByCodePoint(...));
        $prng = new Mulberry32(Fnv1a::hash($this->seed . ':' . $key));

        for ($i = count($result) - 1; $i > 0; $i--) {
            $j = (int) floor($prng->nextFloat() * ($i + 1));
            $temp = $result[$i];
            $result[$i] = $result[$j];
            $result[$j] = $temp;
        }

        return $result;
    }

    /**
     * Returns a single float in `[0, 1)` derived from `seed:key`. The same
     * seed/key pair always produces the same value.
     */
    public function getValue(string $key): float
    {
        return (new Mulberry32(Fnv1a::hash($this->seed . ':' . $key)))->nextFloat();
    }

    /**
     * Cross-language deterministic sort. Uses strcmp (UTF-8 byte order)
     * which matches JS UTF-16 code-unit order for ASCII values — the only
     * values sorted in practice (variant names, hex colors).
     */
    private static function compareByCodePoint(mixed $a, mixed $b): int
    {
        return strcmp((string) $a, (string) $b);
    }

    /**
     * Deduplicates by string representation, keeping the first occurrence.
     * Mirrors the cross-language sort key used by
     * {@see compareByCodePoint()} so that JS and PHP collapse the same
     * set of inputs. `$keyFn` lets callers (e.g. {@see weightedPick()})
     * extract the sort key from a compound element.
     *
     * @template T
     *
     * @param list<T> $items
     * @param (callable(T): string)|null $keyFn
     *
     * @return list<T>
     */
    private static function uniqueByCodePoint(array $items, ?callable $keyFn = null): array
    {
        $seen = [];
        $result = [];

        foreach ($items as $item) {
            $repr = $keyFn !== null ? $keyFn($item) : (string) $item;

            if (!isset($seen[$repr])) {
                $seen[$repr] = true;
                $result[] = $item;
            }
        }

        return $result;
    }
}
