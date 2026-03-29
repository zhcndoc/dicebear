import type { DefinitionElement } from './Element.js';
import { Element } from './Element.js';

export interface DefinitionComponentVariant {
  readonly elements: readonly DefinitionElement[];
  readonly weight?: number;
}

export class ComponentVariant {
  #data: DefinitionComponentVariant;
  #elements?: readonly Element[];

  constructor(data: DefinitionComponentVariant) {
    this.#data = data;
  }

  elements(): readonly Element[] {
    this.#elements ??= this.#data.elements.map((el) => new Element(el));

    return this.#elements;
  }

  weight(): number {
    return this.#data.weight ?? 1;
  }
}
