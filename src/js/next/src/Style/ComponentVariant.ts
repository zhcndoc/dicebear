import type { StyleDefinitionComponentVariant } from '../StyleDefinition.js';
import { Element } from './Element.js';


export class ComponentVariant {
  #data: StyleDefinitionComponentVariant;
  #elements?: readonly Element[];

  constructor(data: StyleDefinitionComponentVariant) {
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
