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

  get values(): readonly string[] {
    return this.#data.values;
  }

  get notEqualTo(): readonly string[] {
    return this.#data.notEqualTo ?? [];
  }

  get contrastTo(): string | undefined {
    return this.#data.contrastTo;
  }
}
