export interface DefinitionComponentTranslate {
  readonly x?: readonly number[];
  readonly y?: readonly number[];
}

export class ComponentTranslate {
  #data: DefinitionComponentTranslate;

  constructor(data: DefinitionComponentTranslate) {
    this.#data = data;
  }

  get x(): readonly number[] {
    return this.#data.x ?? [];
  }

  get y(): readonly number[] {
    return this.#data.y ?? [];
  }
}
