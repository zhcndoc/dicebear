export interface DefinitionMetaCreator {
  readonly name?: string;
  readonly url?: string;
}

export class MetaCreator {
  #data: DefinitionMetaCreator;

  constructor(data: DefinitionMetaCreator) {
    this.#data = data;
  }

  get name(): string | undefined {
    return this.#data.name;
  }

  get url(): string | undefined {
    return this.#data.url;
  }
}
