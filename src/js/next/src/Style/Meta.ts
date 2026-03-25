import type { DefinitionMetaLicense } from './MetaLicense.js';
import type { DefinitionMetaCreator } from './MetaCreator.js';
import type { DefinitionMetaSource } from './MetaSource.js';
import { MetaLicense } from './MetaLicense.js';
import { MetaCreator } from './MetaCreator.js';
import { MetaSource } from './MetaSource.js';

export interface DefinitionMeta {
  readonly license?: DefinitionMetaLicense;
  readonly creator?: DefinitionMetaCreator;
  readonly source?: DefinitionMetaSource;
}

export class Meta {
  #data: DefinitionMeta;
  #license?: MetaLicense;
  #creator?: MetaCreator;
  #source?: MetaSource;

  constructor(data: DefinitionMeta) {
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
