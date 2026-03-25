import type { DefinitionElement } from './Element.js';
import { Element } from './Element.js';

export interface DefinitionComponentVariant {
  readonly elements: readonly DefinitionElement[];
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
}
