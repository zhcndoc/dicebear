export interface DefinitionMetaLicense {
  readonly name?: string;
  readonly url?: string;
  readonly text?: string;
}

export class MetaLicense {
  #data: DefinitionMetaLicense;

  constructor(data: DefinitionMetaLicense) {
    this.#data = data;
  }

  get name(): string | undefined {
    return this.#data.name;
  }

  get url(): string | undefined {
    return this.#data.url;
  }

  get text(): string | undefined {
    return this.#data.text;
  }
}
