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

  weightedPick<T>(key: string, entries: readonly (readonly [T, number])[]): T | undefined {
    if (entries.length === 0) {
      return undefined;
    }

    const sorted = Array.from(entries).sort((a, b) => this.#compareByCodePoint(a[0], b[0]));
    const totalWeight = sorted.reduce((sum, e) => sum + e[1], 0);

    if (totalWeight === 0) {
      return this.pick(key, sorted.map((e) => e[0]));
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
    let state = Prng.fnv1a(this.#seed + ':' + key);

    for (let i = result.length - 1; i > 0; i--) {
      const pair = Prng.mulberry32(state);
      const value = pair[0];

      state = pair[1];

      const j = Math.floor(value * (i + 1));
      const temp = result[i];

      result[i] = result[j];
      result[j] = temp;
    }

    return result;
  }

  // FNV-1a 32-bit hash. Offset basis: 0x811c9dc5, prime: 0x01000193.
  // https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
  static fnv1a(input: string): number {
    let hash = 2166136261;

    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
  }

  static fnv1aHex(input: string): string {
    return Prng.fnv1a(input).toString(16).padStart(8, '0');
  }

  // Mulberry32 PRNG. Returns a random value between 0 and 1, and the next seed.
  // The seed advances by a fixed increment (0x6d2b79f5) per step.
  // https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
  static mulberry32(seed: number): [number, number] {
    const state = (seed + 0x6d2b79f5) | 0;

    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    const result = ((t ^ (t >>> 14)) >>> 0) / 4294967296;

    return [result, state];
  }

  // Combines seed + key via FNV-1a, then runs one Mulberry32 step.
  getValue(key: string): number {
    return Prng.mulberry32(Prng.fnv1a(this.#seed + ':' + key))[0];
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
