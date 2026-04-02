import { Fnv1a } from './Prng/Fnv1a.js';
import { Mulberry32 } from './Prng/Mulberry32.js';

// Key-based pseudorandom number generator.
//
// Each method takes a key that, combined with the seed, produces a
// deterministic value. The same seed + key always yields the same result,
// regardless of call order.
export class Prng {
  #seed: string;

  constructor(seed: string) {
    this.#seed = seed;
  }

  pick<T>(key: string, items: readonly T[]): T | undefined {
    if (items.length === 0) {
      return undefined;
    }

    if (items.length === 1) {
      return items[0];
    }

    const sorted = Array.from(items).sort(this.#compareByCodePoint);
    const index = Math.floor(this.getValue(key) * sorted.length);

    return sorted[index];
  }

  weightedPick<T>(
    key: string,
    entries: readonly (readonly [T, number])[],
  ): T | undefined {
    if (entries.length === 0) {
      return undefined;
    }

    const sorted = Array.from(entries).sort((a, b) =>
      this.#compareByCodePoint(a[0], b[0]),
    );
    const totalWeight = sorted.reduce((sum, e) => sum + e[1], 0);

    if (totalWeight === 0) {
      return this.pick(
        key,
        sorted.map((e) => e[0]),
      );
    }

    const threshold = this.getValue(key) * totalWeight;

    let cumulative = 0;

    for (const [item, weight] of sorted) {
      cumulative += weight;

      if (threshold < cumulative) {
        return item;
      }
    }

    return sorted[sorted.length - 1][0];
  }

  bool(key: string, likelihood: number = 50): boolean {
    return this.getValue(key) * 100 < likelihood;
  }

  float(key: string, values: readonly number[]): number | undefined {
    if (values.length === 0) {
      return undefined;
    }

    const min = Math.min(...values);
    const max = Math.max(...values);

    return Math.round((min + this.getValue(key) * (max - min)) * 10000) / 10000;
  }

  integer(key: string, values: readonly number[]): number | undefined {
    if (values.length === 0) {
      return undefined;
    }

    const min = Math.min(...values);
    const max = Math.max(...values);

    return Math.floor(this.getValue(key) * (max - min + 1)) + min;
  }

  // Fisher-Yates shuffle with chained Mulberry32 state.
  shuffle<T>(key: string, items: readonly T[]): T[] {
    const result = Array.from(items).sort(this.#compareByCodePoint);
    const prng = new Mulberry32(Fnv1a.hash(this.#seed + ':' + key));

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(prng.nextFloat() * (i + 1));
      const temp = result[i];

      result[i] = result[j];
      result[j] = temp;
    }

    return result;
  }

  getValue(key: string): number {
    return new Mulberry32(Fnv1a.hash(this.#seed + ':' + key)).nextFloat();
  }

  // Cross-language deterministic sort: compare by UTF-16 code units of
  // the string representation. Every language can reproduce this by
  // converting values to strings and comparing code unit by code unit.
  #compareByCodePoint<T>(a: T, b: T): number {
    const sa = String(a);
    const sb = String(b);

    if (sa < sb) {
      return -1;
    }

    if (sa > sb) {
      return 1;
    }

    return 0;
  }
}
