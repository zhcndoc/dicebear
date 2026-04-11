import type { StyleDefinitionComponentVariant } from '../StyleDefinition.js';
import { Element } from './Element.js';

/**
 * Read-only view over an entry in a component's `variants` block.
 */
export class ComponentVariant {
  #data: StyleDefinitionComponentVariant;
  #elements?: readonly Element[];

  constructor(data: StyleDefinitionComponentVariant) {
    this.#data = data;
  }

  /**
   * Returns the variant's elements, lazily wrapped as {@link Element}
   * instances on first access.
   */
  elements(): readonly Element[] {
    this.#elements ??= this.#data.elements.map((el) => new Element(el));

    return this.#elements;
  }

  /**
   * Returns the weighted-pick weight for this variant, defaulting to `1`.
   */
  weight(): number {
    return this.#data.weight ?? 1;
  }
}
