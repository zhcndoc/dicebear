import type { StyleDefinitionMetaSource } from '../StyleDefinition.js';


export class MetaSource {
  #data: StyleDefinitionMetaSource;

  constructor(data: StyleDefinitionMetaSource) {
    this.#data = data;
  }

  name(): string | undefined {
    return this.#data.name;
  }

  url(): string | undefined {
    return this.#data.url;
  }
}
