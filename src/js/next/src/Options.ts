import { OptionsValidator } from './Validator/OptionsValidator.js';
import { Prng } from './Prng.js';
import { Color } from './Utils/Color.js';
import { CircularColorReferenceError } from './Error/CircularColorReferenceError.js';
import type { Style } from './Style.js';
import type { StyleOptionsFlipValue, StyleOptionsColorFillValue, StyleOptions } from './StyleOptions.js';

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

  seed(): string {
    return this.#memo('seed', () => this.#data.seed ?? '');
  }

  size(): number | undefined {
    return this.#memo('size', () => this.#data.size);
  }

  idRandomization(): boolean {
    return this.#memo('idRandomization', () => this.#data.idRandomization ?? false);
  }

  flip(): StyleOptionsFlipValue {
    return this.#memo('flip', () =>
      this.#prng.pick('flip', this.#toArray(this.#data.flip)) ?? 'none');
  }

  fontFamily(): string {
    return this.#memo('fontFamily', () =>
      this.#prng.pick('fontFamily', this.#toArray(this.#data.fontFamily)) ?? 'system-ui');
  }

  fontWeight(): number {
    return this.#memo('fontWeight', () =>
      this.#prng.pick('fontWeight', this.#toArray(this.#data.fontWeight)) ?? 400);
  }

  scale(): number {
    return this.#memo('scale', () =>
      this.#prng.float('scale', this.#toArray(this.#data.scale)) ?? 1);
  }

  borderRadius(): number {
    return this.#memo('borderRadius', () =>
      this.#prng.float('borderRadius', this.#toArray(this.#data.borderRadius)) ?? 0);
  }

  // Selects a variant for the given component. Depending on what was passed
  // as `${name}Variant` in the input data:
  // - undefined: PRNG picks from all style variants using their weights
  // - string or string[]: PRNG picks from the given subset (weight 1 each)
  // - Record<string, number>: PRNG picks using the provided weights
  // Only variants that exist in the style definition are considered.
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
        entries = Array.from(variants).map(([v, variant]) => [v, variant.weight()]);
      } else if (typeof raw === 'string' || Array.isArray(raw)) {
        entries = this.#toArray(raw).filter((v) => variants.has(v)).map((v) => [v, 1]);
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
    const key = `${name}ColorFill`;

    return this.#memo(key, () => {
      const raw = this.#get(key) as
        | StyleOptionsColorFillValue
        | readonly StyleOptionsColorFillValue[]
        | undefined;

      return this.#prng.pick(key, this.#toArray(raw)) ?? 'solid';
    });
  }

  colorAngle(name: string): number {
    const key = `${name}ColorAngle`;

    return this.#memo(key, () => {
      const raw = this.#get(key) as number | readonly number[] | undefined;

      return this.#prng.float(key, this.#toArray(raw)) ?? 0;
    });
  }

  rotate(name?: string): number {
    const key = name ? `${name}Rotate` : 'rotate';

    return this.#memo(key, () => {
      const raw = this.#get(key) as number | readonly number[] | undefined;
      let values: readonly number[];

      if (raw === undefined && name) {
        const component = this.#style.components().get(name);
        values = component ? component.rotate() : [];
      } else {
        values = this.#toArray(raw);
      }

      return this.#prng.float(key, values) ?? 0;
    });
  }

  translateX(name?: string): number {
    const key = name ? `${name}TranslateX` : 'translateX';

    return this.#memo(key, () => {
      const raw = this.#get(key) as number | readonly number[] | undefined;
      let values: readonly number[];

      if (raw === undefined && name) {
        const component = this.#style.components().get(name);
        values = component ? component.translate().x() : [];
      } else {
        values = this.#toArray(raw);
      }

      return this.#prng.float(key, values) ?? 0;
    });
  }

  translateY(name?: string): number {
    const key = name ? `${name}TranslateY` : 'translateY';

    return this.#memo(key, () => {
      const raw = this.#get(key) as number | readonly number[] | undefined;
      let values: readonly number[];

      if (raw === undefined && name) {
        const component = this.#style.components().get(name);
        values = component ? component.translate().y() : [];
      } else {
        values = this.#toArray(raw);
      }

      return this.#prng.float(key, values) ?? 0;
    });
  }

  resolved(): StyleOptions<D> {
    return structuredClone(this.#result) as StyleOptions<D>;
  }

  #probability(name: string): number {
    const raw = this.#get(`${name}Probability`) as number | undefined;

    if (raw !== undefined) {
      return raw;
    }

    return this.#style.components().get(name)?.probability() ?? 100;
  }

  #isVisible(name: string): boolean {
    return this.#prng.bool(`${name}Probability`, this.#probability(name));
  }

  #colorFillStops(name: string): number {
    const raw = this.#get(`${name}ColorFillStops`) as
      | number
      | readonly number[]
      | undefined;
    const values = this.#toArray(raw);

    return this.#prng.integer(`${name}ColorFillStops`, values) ?? 2;
  }

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
      // Sort by contrast to a reference color (highest contrast first)
      if (contrastTo) {
        const refColor = this.color(contrastTo)[0];

        if (refColor) {
          candidates = Color.sortByContrast(candidates, refColor);
        }
      }

      // Filter out colors that match excluded references
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

  #get(key: string): unknown {
    return (this.#data as Record<string, unknown>)[key];
  }

  #memo<T>(key: string, compute: () => T): T {
    if (key in this.#result) {
      return this.#result[key] as T;
    }

    const value = compute();

    this.#result[key] = value;

    return value;
  }

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
