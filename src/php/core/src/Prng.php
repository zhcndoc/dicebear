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
     * for an empty list. Items are sorted by their string representation
     * before picking so that input order does not affect the result.
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

        $sorted = $items;
        usort($sorted, self::compareByCodePoint(...));
        $index = (int) floor($this->getValue($key) * count($sorted));

        return $sorted[$index];
    }

    /**
     * Picks an item from `$entries` proportional to its weight. When all
     * weights are zero, falls back to an unweighted {@see pick()}. Returns
     * `null` for an empty list.
     *
     * @param list<array{0: mixed, 1: int|float}> $entries
     */
    public function weightedPick(string $key, array $entries): mixed
    {
        if (count($entries) === 0) {
            return null;
        }

        $sorted = $entries;
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
     * Returns a deterministic float in the closed range
     * `[min($values), max($values)]`, rounded to four decimal places.
     * Returns `null` for an empty list.
     *
     * @param list<int|float> $values
     */
    public function float(string $key, array $values): ?float
    {
        if (count($values) === 0) {
            return null;
        }

        $min = min($values);
        $max = max($values);

        return round(($min + $this->getValue($key) * ($max - $min)) * 10000) / 10000;
    }

    /**
     * Returns a deterministic integer in the closed range
     * `[min($values), max($values)]`. Returns `null` for an empty list.
     *
     * @param list<int|float> $values
     */
    public function integer(string $key, array $values): ?int
    {
        if (count($values) === 0) {
            return null;
        }

        $min = (int) min($values);
        $max = (int) max($values);

        return (int) floor($this->getValue($key) * ($max - $min + 1)) + $min;
    }

    /**
     * Fisher-Yates shuffle with chained Mulberry32 state.
     *
     * @template T
     *
     * @param list<T> $items
     *
     * @return list<T>
     */
    public function shuffle(string $key, array $items): array
    {
        $result = $items;
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
}
