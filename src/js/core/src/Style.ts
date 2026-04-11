import { StyleValidator } from './Validator/StyleValidator.js';
import type {
  StyleDefinition,
  StyleDefinitionAttributes,
} from './StyleDefinition.js';
import { Meta } from './Style/Meta.js';
import { Canvas } from './Style/Canvas.js';
import { Component } from './Style/Component.js';
import { Color } from './Style/Color.js';

export type { StyleDefinition } from './StyleDefinition.js';

/**
 * Validated, lazily-decomposed wrapper around a style definition. Construction
 * runs the JSON Schema validator and stores a deep clone of the input so that
 * later mutation of the source object cannot leak into the rendered avatar.
 */
export class Style<D = unknown> {
  #data: StyleDefinition;
  #meta?: Meta;
  #canvas?: Canvas;
  #components?: ReadonlyMap<string, Component>;
  #colors?: ReadonlyMap<string, Color>;

  constructor(data: D) {
    StyleValidator.validate(data);

    this.#data = structuredClone(data) as StyleDefinition;
  }

  /**
   * Returns the definition's `$id`, or `undefined` when not set.
   */
  id(): string | undefined {
    return this.#data.$id;
  }

  /**
   * Returns the definition's `$schema` URI, or `undefined` when not set.
   */
  schema(): string | undefined {
    return this.#data.$schema;
  }

  /**
   * Returns the definition's `$comment`, or `undefined` when not set.
   */
  comment(): string | undefined {
    return this.#data.$comment;
  }

  /**
   * Returns the {@link Meta} view, lazily constructed on first access.
   */
  meta(): Meta {
    this.#meta ??= new Meta(this.#data.meta ?? {});

    return this.#meta;
  }

  /**
   * Returns a deep clone of the root SVG attributes from the definition,
   * defaulting to an empty object.
   */
  attributes(): StyleDefinitionAttributes {
    return structuredClone(this.#data.attributes ?? {});
  }

  /**
   * Returns a deep clone of the underlying definition.
   */
  definition(): StyleDefinition {
    return structuredClone(this.#data);
  }

  /**
   * Returns the {@link Canvas} view, lazily constructed on first access.
   */
  canvas(): Canvas {
    this.#canvas ??= new Canvas(this.#data.canvas);

    return this.#canvas;
  }

  /**
   * Returns a name → {@link Component} map for all defined components, built
   * lazily on first access.
   */
  components(): ReadonlyMap<string, Component> {
    this.#components ??= new Map(
      Object.entries(this.#data.components ?? {}).map(([name, data]) => [
        name,
        new Component(data),
      ]),
    );

    return this.#components;
  }

  /**
   * Returns a name → {@link Color} map for all defined colors, built lazily
   * on first access.
   */
  colors(): ReadonlyMap<string, Color> {
    this.#colors ??= new Map(
      Object.entries(this.#data.colors ?? {}).map(([name, data]) => [
        name,
        new Color(data),
      ]),
    );

    return this.#colors;
  }
}
