import type { Style } from './Style.js';
import { Options } from './Options.js';
import { Avatar } from './Avatar.js';

export class DiceBear {
  static createAvatar(style: Style, options?: unknown): Avatar {
    const resolvedOptions = options instanceof Options
      ? options
      : new Options(style, options ?? {});

    resolvedOptions.startTracking();

    try {
      const svg = this.#render();

      return new Avatar(svg, resolvedOptions.resolved());
    } finally {
      resolvedOptions.stopTracking();
    }
  }

  static #render(): string {
    // TODO: SVG-Rendering-Logik
    return '';
  }
}
