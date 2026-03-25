import { OptionsValidator } from './Validator/OptionsValidator.js';
import { Prng } from './Prng.js';
import { Color } from './Utils/Color.js';
import { CircularColorReferenceError } from './Error/CircularColorReferenceError.js';
import type { Style } from './Style.js';

export type FlipValue = 'none' | 'horizontal' | 'vertical' | 'both';
export type ColorFillValue = 'solid' | 'linear' | 'radial';

export interface OptionsDefinition {
  readonly seed?: string;
  readonly size?: number;
  readonly idRandomization?: boolean;
  readonly flip?: FlipValue | readonly FlipValue[];
  readonly fontFamily?: string | readonly string[];
  readonly fontWeight?: number | readonly number[];
  readonly scale?: number | readonly [number, number];
  readonly borderRadius?: number | readonly [number, number];
  readonly [key: string]: unknown;
}

export class Options {
  #data: OptionsDefinition;
  #style: Style;
  #prng: Prng;
  #colorCache = new Map<string, readonly string[]>();
  #colorResolving: string[] = [];
  #tracking = false;
  #tracked = new Map<string, unknown>();

  constructor(style: Style, data: unknown, validate = true) {
    if (validate) {
      OptionsValidator.validate(data);
    }

    this.#data = data as OptionsDefinition;
    this.#style = style;
    this.#prng = new Prng(this.seed());
  }

  seed(): string {
    const result = this.#data.seed ?? '';

    this.#track('seed', result);

    return result;
  }

  size(): number | undefined {
    const result = this.#data.size;

    this.#track('size', result);

    return result;
  }

  idRandomization(): boolean {
    const result = this.#data.idRandomization ?? false;

    this.#track('idRandomization', result);

    return result;
  }

  flip(): FlipValue {
    const values = this.#toArray(this.#data.flip);
    const result = this.#prng.pick('flip', values) ?? 'none';

    this.#track('flip', result);

    return result;
  }

  fontFamily(): string {
    const values = this.#toArray(this.#data.fontFamily);
    const result = this.#prng.pick('fontFamily', values) ?? 'system-ui';

    this.#track('fontFamily', result);

    return result;
  }

  fontWeight(): number {
    const values = this.#toArray(this.#data.fontWeight);
    const result = this.#prng.pick('fontWeight', values) ?? 400;

    this.#track('fontWeight', result);

    return result;
  }

  scale(): number {
    const values = this.#toArray(this.#data.scale);
    const result = this.#prng.float('scale', values) ?? 1;

    this.#track('scale', result);

    return result;
  }

  borderRadius(): number {
    const values = this.#toArray(this.#data.borderRadius);
    const result = this.#prng.float('borderRadius', values) ?? 0;

    this.#track('borderRadius', result);

    return result;
  }

  variant(name: string): string | undefined {
    if (!this.#isVisible(name)) {
      return undefined;
    }

    const raw = this.#data[`${name}Variant`] as
      | string
      | readonly string[]
      | undefined;
    const candidates = this.#toArray(raw);
    const component = this.#style.components().get(name);

    if (!component) {
      return undefined;
    }

    const valid = new Set(component.variants().keys());
    const filtered = candidates.filter((v) => valid.has(v));
    const result = this.#prng.pick(
      `${name}Variant`,
      filtered.length > 0 ? filtered : [...valid],
    );

    this.#track(`${name}Variant`, result);

    return result;
  }

  color(name: string): readonly string[] {
    let result = this.#colorCache.get(name);

    if (!result) {
      result = this.#resolveColor(name);
      this.#colorCache.set(name, result);
    }

    this.#track(`${name}Color`, result);

    return result;
  }

  colorFill(name: string): ColorFillValue {
    const raw = this.#data[`${name}ColorFill`] as
      | ColorFillValue
      | readonly ColorFillValue[]
      | undefined;
    const result =
      this.#prng.pick(`${name}ColorFill`, this.#toArray(raw)) ?? 'solid';

    this.#track(`${name}ColorFill`, result);

    return result;
  }

  rotate(name?: string): number {
    const key = name ? `${name}Rotate` : 'rotate';
    const values = this.#toArray(
      this.#data[key] as number | readonly number[] | undefined,
    );
    const result = this.#prng.float(key, values) ?? 0;

    this.#track(key, result);

    return result;
  }

  translateX(name?: string): number {
    const key = name ? `${name}TranslateX` : 'translateX';
    const values = this.#toArray(
      this.#data[key] as number | readonly number[] | undefined,
    );
    const result = this.#prng.float(key, values) ?? 0;

    this.#track(key, result);

    return result;
  }

  translateY(name?: string): number {
    const key = name ? `${name}TranslateY` : 'translateY';
    const values = this.#toArray(
      this.#data[key] as number | readonly number[] | undefined,
    );
    const result = this.#prng.float(key, values) ?? 0;

    this.#track(key, result);

    return result;
  }

  startTracking(): void {
    this.#tracking = true;
    this.#tracked.clear();
  }

  stopTracking(): void {
    this.#tracking = false;
  }

  resolved(): OptionsDefinition {
    return Object.fromEntries(this.#tracked) as OptionsDefinition;
  }

  #probability(name: string): number {
    return (this.#data[`${name}Probability`] as number | undefined) ?? 100;
  }

  #isVisible(name: string): boolean {
    return this.#prng.bool(`${name}Probability`, this.#probability(name));
  }

  #colorFillStops(name: string): number {
    const raw = this.#data[`${name}ColorFillStops`] as
      | number
      | readonly number[]
      | undefined;
    const values = this.#toArray(raw);

    return this.#prng.integer(`${name}ColorFillStops`, values) ?? 2;
  }

  #resolveColor(name: string): readonly string[] {
    // Collect candidates from user options
    const raw = this.#data[`${name}Color`] as
      | string
      | readonly string[]
      | undefined;
    const candidates = [...this.#toArray(raw)];
    const fill = this.colorFill(name);
    const stops = fill === 'solid' ? 1 : this.#colorFillStops(name);

    // Without style definition, shuffle and return
    const styleColor = this.#style.colors().get(name);

    if (!styleColor) {
      return this.#prng.shuffle(`${name}Color`, candidates).slice(0, stops);
    }

    // Detect circular references (e.g. a.contrastTo = b, b.contrastTo = a)
    if (this.#colorResolving.includes(name)) {
      throw new CircularColorReferenceError([...this.#colorResolving, name]);
    }

    this.#colorResolving.push(name);
    const contrastTo = styleColor.contrastTo();
    const notEqualTo = styleColor.notEqualTo();

    try {
      // Sort by contrast to a reference color (highest contrast first)
      if (contrastTo) {
        const refColor = this.color(contrastTo)[0];

        if (refColor) {
          Color.sortByContrast(candidates, refColor);
        }
      }

      // Filter out colors that match excluded references
      if (notEqualTo.length > 0) {
        const excluded = notEqualTo.flatMap((ref) => [...this.color(ref)]);

        Color.filterNotEqualTo(candidates, excluded);
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

  #track(key: string, value: unknown): void {
    if (this.#tracking) {
      this.#tracked.set(key, value);
    }
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
