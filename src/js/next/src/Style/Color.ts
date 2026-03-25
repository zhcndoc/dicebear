export interface DefinitionColor {
  readonly values: readonly string[];
  readonly notEqualTo?: readonly string[];
  readonly contrastTo?: string;
}

export class Color {
  #data: DefinitionColor;

  constructor(data: DefinitionColor) {
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
