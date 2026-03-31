import type { StyleDefinitionMetaCreator } from '../StyleDefinition.js';


export class MetaCreator {
  #data: StyleDefinitionMetaCreator;

  constructor(data: StyleDefinitionMetaCreator) {
    this.#data = data;
  }

  name(): string | undefined {
    return this.#data.name;
  }

  url(): string | undefined {
    return this.#data.url;
  }
}
