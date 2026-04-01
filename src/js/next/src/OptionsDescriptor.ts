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

export class OptionsDescriptor {
  #descriptor?: Descriptor;
  #style: Style;

  constructor(style: Style) {
    this.#style = style;
  }

  toJSON(): Descriptor {
    this.#descriptor ??= this.#build();

    return structuredClone(this.#descriptor);
  }

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
      rotate: { type: 'range', min: -360, max: 360 },
      translateX: { type: 'range', min: -100, max: 100 },
      translateY: { type: 'range', min: -100, max: 100 },
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
      result[`${name}Rotate`] = { type: 'range', min: -360, max: 360 };
      result[`${name}TranslateX`] = { type: 'range', min: -100, max: 100 };
      result[`${name}TranslateY`] = { type: 'range', min: -100, max: 100 };
    }

    for (const name of [...this.#style.colors().keys(), 'background']) {
      result[`${name}Color`] = { type: 'color', list: true };
      result[`${name}ColorFill`] = {
        type: 'enum',
        values: ['solid', 'linear', 'radial'],
        list: true,
      };
      result[`${name}ColorFillStops`] = { type: 'range', min: 1 };
      result[`${name}ColorAngle`] = { type: 'range', min: -360, max: 360 };
    }

    return result;
  }
}
