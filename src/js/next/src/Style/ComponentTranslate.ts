import type { StyleDefinitionComponentTranslate } from '../StyleDefinition.js';


export class ComponentTranslate {
  #data: StyleDefinitionComponentTranslate;

  constructor(data: StyleDefinitionComponentTranslate) {
    this.#data = data;
  }

  x(): readonly number[] {
    return this.#data.x ?? [];
  }

  y(): readonly number[] {
    return this.#data.y ?? [];
  }
}
