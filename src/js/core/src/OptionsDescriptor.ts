import type { Style } from './Style.js';

interface StringField {
  readonly type: 'string';
  readonly list?: true;
}

interface NumberField {
  readonly type: 'number';
  readonly min?: number;
  readonly max?: number;
  readonly list?: true;
}

interface BooleanField {
  readonly type: 'boolean';
}

interface EnumField {
  readonly type: 'enum';
  readonly values: readonly string[];
  readonly list?: true;
  readonly weighted?: true;
}

interface ColorField {
  readonly type: 'color';
  readonly list?: true;
}

interface RangeField {
  readonly type: 'range';
  readonly min?: number;
  readonly max?: number;
}

export type FieldDescriptor =
  | StringField
  | NumberField
  | BooleanField
  | EnumField
  | ColorField
  | RangeField;

export type Descriptor = Record<string, FieldDescriptor>;

/**
 * Builds a descriptor of every option a given style accepts. Tooling such as
 * the editor uses the result to render form controls and validation hints
 * without having to introspect the style itself.
 */
export class OptionsDescriptor {
  static #rotateRange: RangeField = { type: 'range', min: -360, max: 360 };
  static #translateRange: RangeField = { type: 'range', min: -100, max: 100 };

  #descriptor?: Descriptor;
  #style: Style;

  constructor(style: Style) {
    this.#style = style;
  }

  /**
   * Returns a deep clone of the descriptor, building it lazily on first call.
   */
  toJSON(): Descriptor {
    this.#descriptor ??= this.#build();

    return structuredClone(this.#descriptor);
  }

  /**
   * Walks the style's components and colors and assembles the field map.
   */
  #build(): Descriptor {
    const result: Descriptor = {
      seed: { type: 'string' },
      size: { type: 'number', min: 1 },
      idRandomization: { type: 'boolean' },
      title: { type: 'string' },
      flip: {
        type: 'enum',
        values: ['none', 'horizontal', 'vertical', 'both'],
        list: true,
      },
      fontFamily: { type: 'string', list: true },
      fontWeight: { type: 'number', min: 1, max: 1000, list: true },
      scale: { type: 'range', min: 0 },
      borderRadius: { type: 'range', min: 0, max: 50 },
      rotate: OptionsDescriptor.#rotateRange,
      translateX: OptionsDescriptor.#translateRange,
      translateY: OptionsDescriptor.#translateRange,
    };

    for (const [name, component] of this.#style.components()) {
      const variants = Array.from(component.variants().keys()).sort();

      result[`${name}Variant`] = {
        type: 'enum',
        values: variants,
        list: true,
        weighted: true,
      };
      result[`${name}Probability`] = { type: 'number', min: 0, max: 100 };
      result[`${name}Rotate`] = OptionsDescriptor.#rotateRange;
      result[`${name}TranslateX`] = OptionsDescriptor.#translateRange;
      result[`${name}TranslateY`] = OptionsDescriptor.#translateRange;
    }

    for (const name of [...this.#style.colors().keys(), 'background']) {
      result[`${name}Color`] = { type: 'color', list: true };
      result[`${name}ColorFill`] = {
        type: 'enum',
        values: ['solid', 'linear', 'radial'],
        list: true,
      };
      result[`${name}ColorFillStops`] = { type: 'range', min: 2 };
      result[`${name}ColorAngle`] = OptionsDescriptor.#rotateRange;
    }

    return result;
  }
}
