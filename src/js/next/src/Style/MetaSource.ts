export interface DefinitionMetaSource {
  readonly name?: string;
  readonly url?: string;
}

export class MetaSource {
  #data: DefinitionMetaSource;

  constructor(data: DefinitionMetaSource) {
    this.#data = data;
  }

  name(): string | undefined {
    return this.#data.name;
  }

  url(): string | undefined {
    return this.#data.url;
  }
}
