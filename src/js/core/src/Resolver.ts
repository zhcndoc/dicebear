import { Options } from './Options.js';
import { Prng } from './Prng.js';
import { Color } from './Utils/Color.js';
import { CircularColorReferenceError } from './Error/CircularColorReferenceError.js';
import type { Style } from './Style.js';
import type { Component } from './Style/Component.js';
import type {
  StyleOptionsFlipValue,
  StyleOptionsColorFillValue,
  StyleOptions,
} from './StyleOptions.js';

/**
 * Bundles the three inputs needed to derive any deterministic value for an
 * avatar — the {@link Style}, the validated user {@link Options}, and a
 * seeded {@link Prng} — and exposes them as named accessors. Each accessor
 * memoizes its result so that repeated calls cannot drift, and the memo
 * doubles as the snapshot returned by {@link resolved}.
 */
export class Resolver<D = unknown> {
  #style: Style<D>;
  #options: Options<D>;
  #prng: Prng;
  #colorResolving: string[] = [];
  #result: Record<string, unknown> = {};

  constructor(style: Style<D>, options: Options<D>) {
    this.#style = style;
    this.#options = options;
    this.#prng = new Prng(this.seed());
  }

  seed(): string {
    return this.#memo('seed', () => this.#options.seed() ?? '');
  }

  size(): number | undefined {
    return this.#memo('size', () => this.#options.size());
  }

  idRandomization(): boolean {
    return this.#memo('idRandomization', () => this.#options.idRandomization() ?? false);
  }

  title(): string | undefined {
    return this.#memo('title', () => this.#options.title());
  }

  flip(): StyleOptionsFlipValue {
    return this.#memo(
      'flip',
      () => this.#prng.pick('flip', this.#options.flip()) ?? 'none',
    );
  }

  fontFamily(): string {
    return this.#memo(
      'fontFamily',
      () => this.#prng.pick('fontFamily', this.#options.fontFamily()) ?? 'system-ui',
    );
  }

  fontWeight(): number {
    return this.#memo(
      'fontWeight',
      () => this.#prng.pick('fontWeight', this.#options.fontWeight()) ?? 400,
    );
  }

  scale(): number {
    return this.#memo(
      'scale',
      () => this.#prng.float('scale', this.#options.scale()) ?? 1,
    );
  }

  borderRadius(): number {
    return this.#memo(
      'borderRadius',
      () => this.#prng.float('borderRadius', this.#options.borderRadius()) ?? 0,
    );
  }

  rotate(): number {
    return this.#memo(
      'rotate',
      () => this.#prng.float('rotate', this.#options.rotate()) ?? 0,
    );
  }

  translateX(): number {
    return this.#memo(
      'translateX',
      () => this.#prng.float('translateX', this.#options.translateX()) ?? 0,
    );
  }

  translateY(): number {
    return this.#memo(
      'translateY',
      () => this.#prng.float('translateY', this.#options.translateY()) ?? 0,
    );
  }

  /**
   * Selects a variant for the given component. Depending on what was passed
   * as `${name}Variant` in the input data:
   *
   * - `undefined`: PRNG picks from all style variants using their weights.
   * - `string` or `string[]`: PRNG picks from the given subset (weight 1 each).
   * - `Record<string, number>`: PRNG picks using the provided weights.
   *
   * Only variants that exist in the style definition are considered.
   */
  variant(name: string): string | undefined {
    return this.#memo(`${name}Variant`, () => {
      const component = this.#style.components().get(name);

      if (!component || !this.#isVisible(name, component)) {
        return undefined;
      }

      const raw = this.#options.componentVariant(component.sourceName());
      const variants = component.variants();
      let entries: [string, number][];

      if (raw === undefined) {
        entries = Array.from(variants).map(([v, variant]) => [
          v,
          variant.weight(),
        ]);
      } else if (Array.isArray(raw)) {
        entries = raw
          .filter((v): v is string => variants.has(v))
          .map((v) => [v, 1]);
      } else {
        entries = Object.entries(raw).filter(([v]) => variants.has(v));
      }

      return this.#prng.weightedPick(`${name}Variant`, entries);
    });
  }

  color(name: string): readonly string[] {
    return this.#memo(`${name}Color`, () => this.#resolveColor(name));
  }

  colorFill(name: string): StyleOptionsColorFillValue {
    return this.#memo(
      `${name}ColorFill`,
      () =>
        this.#prng.pick(`${name}ColorFill`, this.#options.colorFill(name)) ??
        'solid',
    );
  }

  colorAngle(name: string): number {
    return this.#memo(
      `${name}ColorAngle`,
      () => this.#prng.float(`${name}ColorAngle`, this.#options.colorAngle(name)) ?? 0,
    );
  }

  /**
   * Per-component transform values are render-time decorations derived per
   * `<use>` reference, not user-input options that should round-trip. They
   * are intentionally not memoized and so never appear in {@link resolved}.
   */
  componentTransform(name: string): {
    rotate: number;
    translateX: number;
    translateY: number;
    scale: number;
  } {
    const component = this.#style.components().get(name);

    return {
      rotate: this.#pickFloat(name, 'Rotate', component?.rotate() ?? [], 0),
      translateX: this.#pickFloat(name, 'TranslateX', component?.translate().x() ?? [], 0),
      translateY: this.#pickFloat(name, 'TranslateY', component?.translate().y() ?? [], 0),
      scale: this.#pickFloat(name, 'Scale', component?.scale() ?? [], 1),
    };
  }

  /**
   * Returns every value that has been touched during this resolution. Only
   * memoized entries are included; unset options remain `undefined` and
   * disappear on `JSON.stringify()`. Per-component transform values from
   * {@link componentTransform} are intentionally not memoized and therefore
   * do not appear in the snapshot.
   *
   * The returned object aliases the internal cache; callers that need
   * isolation (e.g. {@link Avatar.toJSON}) clone it themselves.
   */
  resolved(): StyleOptions<D> {
    return this.#result as StyleOptions<D>;
  }

  /**
   * Returns the visibility probability (0–100) for the given component.
   * Aliases read the source component's user-set probability so a single
   * `<source>Probability` option propagates to every alias of the source.
   */
  #probability(component: Component): number {
    const raw = this.#options.componentProbability(component.sourceName());

    return raw ?? component.probability();
  }

  #isVisible(name: string, component: Component): boolean {
    return this.#prng.bool(`${name}Probability`, this.#probability(component));
  }

  /**
   * Resolves a named color to its final stop list, applying contrast sorting
   * and `notEqualTo` filtering from the style definition. Detects circular
   * references between colors and throws {@link CircularColorReferenceError}.
   */
  #resolveColor(name: string): readonly string[] {
    const userColors = this.#options.color(name);
    const styleColor = this.#style.colors().get(name);
    const source = userColors ?? styleColor?.values() ?? [];

    let candidates = source.map((c) => Color.toHex(c));
    const fill = this.colorFill(name);
    const stops = fill === 'solid' ? 1 : this.#colorFillStops(name);

    if (!styleColor) {
      return this.#prng.shuffle(`${name}Color`, candidates).slice(0, stops);
    }

    // Detect circular references (e.g. a.contrastTo = b, b.contrastTo = a)
    if (this.#colorResolving.includes(name)) {
      throw new CircularColorReferenceError(this.#colorResolving.concat(name));
    }

    this.#colorResolving.push(name);
    const contrastTo = styleColor.contrastTo();
    const notEqualTo = styleColor.notEqualTo();

    try {
      if (contrastTo) {
        const refColor = this.color(contrastTo)[0];

        if (refColor) {
          candidates = Color.sortByContrast(candidates, refColor);
        }
      }

      if (notEqualTo.length > 0) {
        const excluded: string[] = [];

        for (const ref of notEqualTo) {
          for (const color of this.color(ref)) {
            excluded.push(color);
          }
        }

        candidates = Color.filterNotEqualTo(candidates, excluded);
      }
    } finally {
      this.#colorResolving.pop();
    }

    // Skip shuffle when sorted by contrast to preserve the ordering
    const ordered = contrastTo
      ? candidates
      : this.#prng.shuffle(`${name}Color`, candidates);

    return ordered.slice(0, stops);
  }

  #colorFillStops(name: string): number {
    return (
      this.#prng.integer(`${name}ColorFillStops`, this.#options.colorFillStops(name)) ?? 2
    );
  }

  #pickFloat(
    name: string,
    suffix: string,
    range: readonly number[],
    fallback: number,
  ): number {
    return this.#prng.float(`${name}${suffix}`, range) ?? fallback;
  }

  #memo<T>(key: string, compute: () => T): T {
    if (key in this.#result) {
      return this.#result[key] as T;
    }

    const value = compute();

    this.#result[key] = value;

    return value;
  }
}
