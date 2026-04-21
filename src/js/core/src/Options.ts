import { OptionsValidator } from './Validator/OptionsValidator.js';
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
 * Validates raw avatar options and resolves them deterministically against
 * the style definition. Each accessor returns the resolved value for the
 * current seed and memoizes it so that repeated calls cannot drift.
 */
export class Options<D = unknown> {
  #data: StyleOptions<D>;
  #style: Style<D>;
  #prng: Prng;
  #colorResolving: string[] = [];
  #result: Record<string, unknown> = {};

  constructor(style: Style<D>, data: StyleOptions<D>) {
    OptionsValidator.validate(data);

    this.#data = structuredClone(data);
    this.#style = style;
    this.#prng = new Prng(this.seed());
  }

  /**
   * Returns the seed string, defaulting to an empty string when unset.
   */
  seed(): string {
    return this.#memo('seed', () => this.#data.seed ?? '');
  }

  /**
   * Returns the requested output size in pixels, or `undefined` to keep the
   * intrinsic viewBox dimensions.
   */
  size(): number | undefined {
    return this.#memo('size', () => this.#data.size);
  }

  /**
   * Returns whether `<defs>` IDs should be suffixed with a random token to
   * keep multiple inlined avatars from colliding.
   */
  idRandomization(): boolean {
    return this.#memo(
      'idRandomization',
      () => this.#data.idRandomization ?? false,
    );
  }

  /**
   * Returns the accessible title, or `undefined` when unset.
   */
  title(): string | undefined {
    return this.#memo('title', () => this.#data.title);
  }

  /**
   * Returns the resolved flip mode: `'none'`, `'horizontal'`, `'vertical'`,
   * or `'both'`. Defaults to `'none'`.
   */
  flip(): StyleOptionsFlipValue {
    return this.#memo(
      'flip',
      () => this.#prng.pick('flip', this.#toArray(this.#data.flip)) ?? 'none',
    );
  }

  /**
   * Returns the resolved font family, defaulting to `system-ui`.
   */
  fontFamily(): string {
    return this.#memo(
      'fontFamily',
      () =>
        this.#prng.pick('fontFamily', this.#toArray(this.#data.fontFamily)) ??
        'system-ui',
    );
  }

  /**
   * Returns the resolved font weight, defaulting to `400`.
   */
  fontWeight(): number {
    return this.#memo(
      'fontWeight',
      () =>
        this.#prng.pick('fontWeight', this.#toArray(this.#data.fontWeight)) ??
        400,
    );
  }

  /**
   * Returns the resolved uniform scale factor for the avatar root or the
   * named component, defaulting to `1`.
   */
  scale(name?: string): number {
    return this.#numericComponentOption('scale', name, (c) => c.scale(), 1);
  }

  /**
   * Returns the resolved border-radius percentage (0–50), defaulting to `0`.
   */
  borderRadius(): number {
    return this.#memo(
      'borderRadius',
      () =>
        this.#prng.float(
          'borderRadius',
          this.#toArray(this.#data.borderRadius),
        ) ?? 0,
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
      if (!this.#isVisible(name)) {
        return undefined;
      }

      const component = this.#style.components().get(name);

      if (!component) {
        return undefined;
      }

      const raw = this.#get(`${name}Variant`) as
        | string
        | readonly string[]
        | Readonly<Record<string, number>>
        | undefined;
      const variants = component.variants();

      let entries: [string, number][];

      if (raw === undefined) {
        entries = Array.from(variants).map(([v, variant]) => [
          v,
          variant.weight(),
        ]);
      } else if (typeof raw === 'string' || Array.isArray(raw)) {
        entries = this.#toArray(raw)
          .filter((v) => variants.has(v))
          .map((v) => [v, 1]);
      } else {
        entries = Object.entries(raw).filter(([v]) => variants.has(v));
      }

      return this.#prng.weightedPick(`${name}Variant`, entries);
    });
  }

  /**
   * Returns the resolved color stop list for the named color, suitable for
   * solid fills (length 1) or gradients (length ≥ 2).
   */
  color(name: string): readonly string[] {
    return this.#memo(`${name}Color`, () => this.#resolveColor(name));
  }

  /**
   * Returns the resolved fill type for the named color, defaulting to
   * `'solid'`.
   */
  colorFill(name: string): StyleOptionsColorFillValue {
    const key = `${name}ColorFill`;

    return this.#memo(key, () => {
      const raw = this.#get(key) as
        | StyleOptionsColorFillValue
        | readonly StyleOptionsColorFillValue[]
        | undefined;

      return this.#prng.pick(key, this.#toArray(raw)) ?? 'solid';
    });
  }

  /**
   * Returns the resolved gradient rotation angle (in degrees) for the named
   * color, defaulting to `0`.
   */
  colorAngle(name: string): number {
    const key = `${name}ColorAngle`;

    return this.#memo(key, () => {
      const raw = this.#get(key) as number | readonly number[] | undefined;

      return this.#prng.float(key, this.#toArray(raw)) ?? 0;
    });
  }

  /**
   * Returns the resolved rotation angle for the avatar root or the named
   * component, defaulting to `0`.
   */
  rotate(name?: string): number {
    return this.#numericComponentOption('rotate', name, (c) => c.rotate());
  }

  /**
   * Returns the resolved horizontal translation for the avatar root or the
   * named component, defaulting to `0`.
   */
  translateX(name?: string): number {
    return this.#numericComponentOption('translateX', name, (c) =>
      c.translate().x(),
    );
  }

  /**
   * Returns the resolved vertical translation for the avatar root or the
   * named component, defaulting to `0`.
   */
  translateY(name?: string): number {
    return this.#numericComponentOption('translateY', name, (c) =>
      c.translate().y(),
    );
  }

  /**
   * Returns a deep clone of every option that has been touched during this
   * resolution. Only memoized values are included; unset options remain
   * `undefined` and disappear on `JSON.stringify()`.
   */
  resolved(): StyleOptions<D> {
    return structuredClone(this.#result) as StyleOptions<D>;
  }

  /**
   * Shared resolution path for the numeric component options
   * (`rotate`/`translateX`/`translateY`/`scale`). Falls back to the
   * component-level defaults from the style definition when the option is
   * unset, and to `defaultValue` when no definition default exists either.
   */
  #numericComponentOption(
    option: string,
    name: string | undefined,
    componentDefault: (c: Component) => readonly number[],
    defaultValue: number = 0,
  ): number {
    const key = name
      ? `${name}${option.charAt(0).toUpperCase()}${option.slice(1)}`
      : option;

    return this.#memo(key, () => {
      const raw = this.#get(key) as number | readonly number[] | undefined;
      let values: readonly number[];

      if (raw === undefined && name) {
        const component = this.#style.components().get(name);
        values = component ? componentDefault(component) : [];
      } else {
        values = this.#toArray(raw);
      }

      return this.#prng.float(key, values) ?? defaultValue;
    });
  }

  /**
   * Returns the visibility probability (0–100) for the named component,
   * falling back to the component definition default of `100`.
   */
  #probability(name: string): number {
    const raw = this.#get(`${name}Probability`) as number | undefined;

    if (raw !== undefined) {
      return raw;
    }

    return this.#style.components().get(name)?.probability() ?? 100;
  }

  /**
   * Returns whether the named component should be rendered for this seed.
   */
  #isVisible(name: string): boolean {
    return this.#prng.bool(`${name}Probability`, this.#probability(name));
  }

  /**
   * Returns the resolved number of gradient stops (≥ 2) for the named color.
   */
  #colorFillStops(name: string): number {
    const raw = this.#get(`${name}ColorFillStops`) as
      | number
      | readonly number[]
      | undefined;
    const values = this.#toArray(raw);

    return this.#prng.integer(`${name}ColorFillStops`, values) ?? 2;
  }

  /**
   * Resolves a named color to its final stop list, applying contrast sorting
   * and `notEqualTo` filtering from the style definition. Detects circular
   * references between colors and throws {@link CircularColorReferenceError}.
   */
  #resolveColor(name: string): readonly string[] {
    const raw = this.#get(`${name}Color`) as
      | string
      | readonly string[]
      | undefined;
    const styleColor = this.#style.colors().get(name);
    let source: readonly string[];

    if (raw === undefined) {
      source = styleColor ? styleColor.values() : [];
    } else {
      source = this.#toArray(raw);
    }

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

  /**
   * Returns a raw option value from the input data without resolution.
   */
  #get(key: string): unknown {
    return (this.#data as Record<string, unknown>)[key];
  }

  /**
   * Resolves and caches an option under `key`, returning the cached value on
   * subsequent calls.
   */
  #memo<T>(key: string, compute: () => T): T {
    if (key in this.#result) {
      return this.#result[key] as T;
    }

    const value = compute();

    this.#result[key] = value;

    return value;
  }

  /**
   * Normalizes a scalar/array/undefined value into a readonly array.
   */
  #toArray<T>(value: T | readonly T[] | undefined): readonly T[] {
    if (value === undefined) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [value as T];
  }
}
