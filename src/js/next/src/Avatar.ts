import { Style } from './Style.js';
import { Options, type OptionsDefinition } from './Options.js';
import { Renderer } from './Renderer.js';

export interface AvatarJson {
  readonly svg: string;
  readonly options: OptionsDefinition;
}

export class Avatar {
  #svg: string;
  #resolvedOptions: OptionsDefinition;

  constructor(style: Style | unknown, options?: Options | unknown) {
    const resolvedStyle = style instanceof Style
      ? style
      : new Style(style);
    const resolvedOptions = options instanceof Options
      ? options
      : new Options(resolvedStyle, options ?? {});

    resolvedOptions.startTracking();

    try {
      this.#svg = new Renderer(resolvedStyle, resolvedOptions).render();
      this.#resolvedOptions = resolvedOptions.resolved();
    } finally {
      resolvedOptions.stopTracking();
    }
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
