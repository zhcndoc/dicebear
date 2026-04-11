import type { StyleDefinitionComponentTranslate } from '../StyleDefinition.js';

/**
 * Read-only view over a component's `translate` block, providing the X and Y
 * offset ranges.
 */
export class ComponentTranslate {
  #data: StyleDefinitionComponentTranslate;

  constructor(data: StyleDefinitionComponentTranslate) {
    this.#data = data;
  }

  /**
   * Returns the horizontal offset range, or an empty list when unset.
   */
  x(): readonly number[] {
    return this.#data.x ?? [];
  }

  /**
   * Returns the vertical offset range, or an empty list when unset.
   */
  y(): readonly number[] {
    return this.#data.y ?? [];
  }
}
