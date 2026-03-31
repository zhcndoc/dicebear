import type { StyleDefinitionMetaLicense } from '../StyleDefinition.js';


export class MetaLicense {
  #data: StyleDefinitionMetaLicense;

  constructor(data: StyleDefinitionMetaLicense) {
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
