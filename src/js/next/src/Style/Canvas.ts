import type { DefinitionElement } from './Element.js';
import { Element } from './Element.js';

export interface DefinitionCanvas {
  readonly width: number;
  readonly height: number;
  readonly elements: readonly DefinitionElement[];
}

export class Canvas {
  #data: DefinitionCanvas;
  #elements?: readonly Element[];

  constructor(data: DefinitionCanvas) {
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
