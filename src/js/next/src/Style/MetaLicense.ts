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

  name(): string | undefined {
    return this.#data.name;
  }

  url(): string | undefined {
    return this.#data.url;
  }

  text(): string | undefined {
    return this.#data.text;
  }
}
