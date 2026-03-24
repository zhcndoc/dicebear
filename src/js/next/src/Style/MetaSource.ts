export interface DefinitionMetaSource {
  readonly name?: string;
  readonly url?: string;
}

export class MetaSource {
  #data: DefinitionMetaSource;

  constructor(data: DefinitionMetaSource) {
    this.#data = data;
  }

  get name(): string | undefined {
    return this.#data.name;
  }

  get url(): string | undefined {
    return this.#data.url;
  }
}
