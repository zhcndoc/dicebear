import { OptionsValidator } from './Validator/OptionsValidator.js';
import type {
  StyleOptions,
  StyleOptionsFlipValue,
  StyleOptionsColorFillValue,
} from './StyleOptions.js';

/**
 * Validates the raw user-supplied options and exposes them through typed
 * accessors. Each accessor returns the user's input in a normalized form
 * (always an array for options that accept either a scalar or an array, or
 * `undefined` when the option is not set), so consumers — chiefly
 * {@link Resolver} — never have to do their own normalization.
 *
 * Resolution against the style definition and the PRNG happens in
 * {@link Resolver}; this class is purely about reading user input.
 */
export class Options<D = unknown> {
  #data: StyleOptions<D>;

  constructor(data: StyleOptions<D> = {} as StyleOptions<D>) {
    OptionsValidator.validate(data);

    this.#data = structuredClone(data);
  }

  seed(): string | undefined {
    return this.#data.seed;
  }

  size(): number | undefined {
    return this.#data.size;
  }

  idRandomization(): boolean | undefined {
    return this.#data.idRandomization;
  }

  title(): string | undefined {
    return this.#data.title;
  }

  flip(): readonly StyleOptionsFlipValue[] {
    return this.#asArray(this.#data.flip);
  }

  fontFamily(): readonly string[] {
    return this.#asArray(this.#data.fontFamily);
  }

  fontWeight(): readonly number[] {
    return this.#asArray(this.#data.fontWeight);
  }

  scale(): readonly number[] {
    return this.#asArray(this.#data.scale);
  }

  borderRadius(): readonly number[] {
    return this.#asArray(this.#data.borderRadius);
  }

  rotate(): readonly number[] {
    return this.#asArray(this.#data.rotate);
  }

  translateX(): readonly number[] {
    return this.#asArray(this.#data.translateX);
  }

  translateY(): readonly number[] {
    return this.#asArray(this.#data.translateY);
  }

  /**
   * Returns the user-set variant constraint for `name`:
   * - `undefined` when the user did not set `${name}Variant`,
   * - `string[]` when the user gave a string or string list (each weighted 1),
   * - `Record<string, number>` when the user gave a weighted map.
   */
  componentVariant(
    name: string,
  ): readonly string[] | Readonly<Record<string, number>> | undefined {
    const raw = this.#dynamic(`${name}Variant`);

    if (raw === undefined) {
      return undefined;
    }

    if (typeof raw === 'string' || Array.isArray(raw)) {
      return this.#asArray(raw as string | readonly string[]);
    }

    return raw as Readonly<Record<string, number>>;
  }

  componentProbability(name: string): number | undefined {
    return this.#dynamic(`${name}Probability`) as number | undefined;
  }

  /**
   * Asymmetric on purpose: returns `undefined` (rather than `[]`) when
   * `${name}Color` is unset so the resolver can fall back to the style
   * definition's color values.
   */
  color(name: string): readonly string[] | undefined {
    const raw = this.#dynamic(`${name}Color`);

    return raw === undefined
      ? undefined
      : this.#asArray(raw as string | readonly string[]);
  }

  colorFill(name: string): readonly StyleOptionsColorFillValue[] {
    return this.#asArray(
      this.#dynamic(`${name}ColorFill`) as
        | StyleOptionsColorFillValue
        | readonly StyleOptionsColorFillValue[]
        | undefined,
    );
  }

  colorAngle(name: string): readonly number[] {
    return this.#asArray(
      this.#dynamic(`${name}ColorAngle`) as
        | number
        | readonly number[]
        | undefined,
    );
  }

  colorFillStops(name: string): readonly number[] {
    return this.#asArray(
      this.#dynamic(`${name}ColorFillStops`) as
        | number
        | readonly number[]
        | undefined,
    );
  }

  /**
   * Returns the raw value of a dynamic-key option (e.g. `${name}Color`)
   * untouched. Used for keys that are not statically declared on
   * {@link StyleOptions}.
   */
  #dynamic(key: string): unknown {
    return (this.#data as Record<string, unknown>)[key];
  }

  /** Normalizes a scalar/array/undefined value into a readonly array. */
  #asArray<T>(value: T | readonly T[] | undefined): readonly T[] {
    if (value === undefined) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [value as T];
  }
}
