import type { StyleDefinitionColor } from '../StyleDefinition.js';

export class Color {
  #data: StyleDefinitionColor;

  constructor(data: StyleDefinitionColor) {
    this.#data = data;
  }

  values(): readonly string[] {
    return this.#data.values;
  }

  notEqualTo(): readonly string[] {
    return this.#data.notEqualTo ?? [];
  }

  contrastTo(): string | undefined {
    return this.#data.contrastTo;
  }
}
