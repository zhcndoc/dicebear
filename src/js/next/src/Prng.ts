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

    const index = Math.floor(this.getValue(key) * items.length);

    return items[index];
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
    const result = [...items];
    let state = this.fnv1a(this.#seed + ':' + key);

    for (let i = result.length - 1; i > 0; i--) {
      const [value, next] = this.mulberry32(state);

      state = next;

      const j = Math.floor(value * (i + 1));

      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  // FNV-1a 32-bit hash. Offset basis: 0x811c9dc5, prime: 0x01000193.
  // https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
  fnv1a(input: string): number {
    let hash = 2166136261;

    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
  }

  // Mulberry32 PRNG. Returns a random value between 0 and 1, and the next seed.
  // The seed advances by a fixed increment (0x6d2b79f5) per step.
  // https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
  mulberry32(seed: number): [number, number] {
    const state = (seed + 0x6d2b79f5) | 0;

    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return [((t ^ (t >>> 14)) >>> 0) / 4294967296, state];
  }

  // Combines seed + key via FNV-1a, then runs one Mulberry32 step.
  getValue(key: string): number {
    return this.mulberry32(this.fnv1a(this.#seed + ':' + key))[0];
  }
}
