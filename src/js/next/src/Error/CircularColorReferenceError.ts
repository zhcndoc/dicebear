export class CircularColorReferenceError extends Error {
  readonly chain: readonly string[];

  constructor(chain: readonly string[]) {
    const path = chain.join(' → ');

    super(`Circular color reference: ${path}`);
    this.name = 'CircularColorReferenceError';
    this.chain = chain;
  }
}
