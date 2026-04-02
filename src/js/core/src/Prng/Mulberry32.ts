// Mulberry32 PRNG — stateful, matching the C reference by Tommy Ettinger.
// https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
//
// C original:
//   uint32_t z = (x += 0x6D2B79F5UL);
//   z = (z ^ (z >> 15)) * (z | 1UL);
//   z ^= z + (z ^ (z >> 7)) * (z | 61UL);
//   return z ^ (z >> 14);
const UINT32_MAX_PLUS_1 = 2 ** 32;

export class Mulberry32 {
  #state: number;

  constructor(seed: number) {
    this.#state = seed;
  }

  next(): number {
    const z = (this.#state = (this.#state + 0x6d2b79f5) | 0);

    let t = Math.imul(z ^ (z >>> 15), z | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0);
  }

  nextFloat(): number {
    return this.next() / UINT32_MAX_PLUS_1;
  }

  state(): number {
    return this.#state;
  }
}
