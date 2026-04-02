// FNV-1a 32-bit hash.
// Offset basis: 0x811c9dc5, prime: 0x01000193.
// https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
export class Fnv1a {
  static hash(input: string): number {
    let hash = 0x811c9dc5;

    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }

    return hash >>> 0;
  }

  static hex(input: string): string {
    return Fnv1a.hash(input).toString(16).padStart(8, '0');
  }
}
