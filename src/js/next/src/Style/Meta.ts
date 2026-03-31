import type { StyleDefinitionMeta } from '../StyleDefinition.js';
import { MetaLicense } from './MetaLicense.js';
import { MetaCreator } from './MetaCreator.js';
import { MetaSource } from './MetaSource.js';


export class Meta {
  #data: StyleDefinitionMeta;
  #license?: MetaLicense;
  #creator?: MetaCreator;
  #source?: MetaSource;

  constructor(data: StyleDefinitionMeta) {
    this.#data = data;
  }

  license(): MetaLicense {
    this.#license ??= new MetaLicense(this.#data.license ?? {});

    return this.#license;
  }

  creator(): MetaCreator {
    this.#creator ??= new MetaCreator(this.#data.creator ?? {});

    return this.#creator;
  }

  source(): MetaSource {
    this.#source ??= new MetaSource(this.#data.source ?? {});

    return this.#source;
  }
}
