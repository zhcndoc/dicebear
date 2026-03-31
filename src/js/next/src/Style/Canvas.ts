import type { StyleDefinitionCanvas } from '../StyleDefinition.js';
import { Element } from './Element.js';


export class Canvas {
  #data: StyleDefinitionCanvas;
  #elements?: readonly Element[];

  constructor(data: StyleDefinitionCanvas) {
    this.#data = data;
  }

  width(): number {
    return this.#data.width;
  }

  height(): number {
    return this.#data.height;
  }

  elements(): readonly Element[] {
    this.#elements ??= this.#data.elements.map((el) => new Element(el));

    return this.#elements;
  }
}
