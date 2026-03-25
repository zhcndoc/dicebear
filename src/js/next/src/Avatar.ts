import type { OptionsDefinition } from './Options.js';

export interface AvatarJson {
  readonly svg: string;
  readonly options: OptionsDefinition;
}

export class Avatar {
  #svg: string;
  #resolvedOptions: OptionsDefinition;

  constructor(svg: string, resolvedOptions: OptionsDefinition) {
    this.#svg = svg;
    this.#resolvedOptions = resolvedOptions;
  }

  toString(): string {
    return this.#svg;
  }

  toJson(): AvatarJson {
    return {
      svg: this.#svg,
      options: this.#resolvedOptions,
    };
  }

  toDataUri(): string {
    return `data:image/svg+xml;utf8,${encodeURIComponent(this.#svg)}`;
  }
}
