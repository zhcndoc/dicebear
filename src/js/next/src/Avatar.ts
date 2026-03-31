import { Style } from './Style.js';
import { Options } from './Options.js';
import { Renderer } from './Renderer.js';
import type { StyleOptions } from './StyleOptions.js';

type UnwrapStyle<D> = D extends Style<infer S> ? S : D;

interface AvatarJson<D = unknown> {
  readonly svg: string;
  readonly options: StyleOptions<UnwrapStyle<D>>;
}

export class Avatar<D = unknown> {
  #svg: string;
  #resolvedOptions: StyleOptions<UnwrapStyle<D>>;

  constructor(style: D, options?: StyleOptions<UnwrapStyle<D>>) {
    const resolvedStyle = style instanceof Style
      ? style
      : new Style(style);
    const resolvedOptions = new Options(resolvedStyle, options ?? {});

    this.#svg = new Renderer(resolvedStyle, resolvedOptions).render();
    this.#resolvedOptions = resolvedOptions.resolved();
  }

  toString(): string {
    return this.#svg;
  }

  toJson(): AvatarJson<D> {
    return {
      svg: this.#svg,
      options: this.#resolvedOptions,
    };
  }

  toDataUri(): string {
    return `data:image/svg+xml;utf8,${encodeURIComponent(this.#svg)}`;
  }
}
