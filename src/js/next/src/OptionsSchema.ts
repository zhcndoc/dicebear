import type { Style } from './Style.js';

type JsonSchema = Record<string, unknown>;

export class OptionsSchema {
  static readonly #colorPattern = '^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$';

  #schema?: JsonSchema;
  #style: Style;

  constructor(style: Style) {
    this.#style = style;
  }

  toJSON(): JsonSchema {
    this.#schema ??= this.#build();

    return structuredClone(this.#schema);
  }

  #build(): JsonSchema {
    const properties: Record<string, JsonSchema> = {
      seed: { type: 'string' },
      size: { type: 'integer', minimum: 1 },
      idRandomization: { type: 'boolean' },
      flip: this.#singleOrArray({ type: 'string', enum: ['none', 'horizontal', 'vertical', 'both'] }),
      fontFamily: this.#singleOrArray({ type: 'string' }),
      fontWeight: this.#singleOrArray({ type: 'integer', minimum: 1, maximum: 1000 }),
      scale: this.#singleOrArray({ type: 'number', minimum: 0 }, 2),
      borderRadius: this.#range(0, 50),
      rotate: this.#range(-360, 360),
      translateX: this.#range(-100, 100),
      translateY: this.#range(-100, 100),
    };

    for (const [name, component] of this.#style.components()) {
      const variants = Array.from(component.variants().keys()).sort();

      properties[`${name}Variant`] = this.#variant(variants);
      properties[`${name}Probability`] = { type: 'number', minimum: 0, maximum: 100 };
      properties[`${name}Rotate`] = this.#range(-360, 360);
      properties[`${name}TranslateX`] = this.#range(-100, 100);
      properties[`${name}TranslateY`] = this.#range(-100, 100);
    }

    for (const name of [...this.#style.colors().keys(), 'background']) {
      properties[`${name}Color`] = this.#color();
      properties[`${name}ColorFill`] = this.#colorFill();
      properties[`${name}ColorFillStops`] = this.#singleOrArray({ type: 'integer', minimum: 1 }, 2);
      properties[`${name}ColorAngle`] = this.#range(-360, 360);
    }

    return {
      type: 'object',
      properties,
      additionalProperties: false,
    };
  }

  #singleOrArray(schema: JsonSchema, maxItems?: number): JsonSchema {
    const arraySchema: JsonSchema = { type: 'array', items: schema };

    if (maxItems !== undefined) {
      arraySchema.maxItems = maxItems;
    }

    return { oneOf: [schema, arraySchema] };
  }

  #range(min: number, max: number): JsonSchema {
    return this.#singleOrArray({ type: 'number', minimum: min, maximum: max }, 2);
  }

  #variant(names: readonly string[]): JsonSchema {
    return {
      oneOf: [
        { type: 'string', enum: names },
        { type: 'array', items: { type: 'string', enum: names } },
        {
          type: 'object',
          propertyNames: { enum: names },
          additionalProperties: { type: 'number', minimum: 0 },
        },
      ],
    };
  }

  #color(): JsonSchema {
    return this.#singleOrArray({ type: 'string', pattern: OptionsSchema.#colorPattern });
  }

  #colorFill(): JsonSchema {
    return this.#singleOrArray({ type: 'string', enum: ['solid', 'linear', 'radial'] });
  }
}
