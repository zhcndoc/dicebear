import { StyleValidator } from './Validator/StyleValidator.js';
import { StyleValidationError } from './Error/StyleValidationError.js';
import type { StyleDefinition, StyleDefinitionAttributes } from './StyleDefinition.js';
import { Meta } from './Style/Meta.js';
import { Canvas } from './Style/Canvas.js';
import { Component } from './Style/Component.js';
import { Color } from './Style/Color.js';

export type { StyleDefinition } from './StyleDefinition.js';

export class Style<D = unknown> {
  #data: StyleDefinition;
  #meta?: Meta;
  #canvas?: Canvas;
  #components?: ReadonlyMap<string, Component>;
  #colors?: ReadonlyMap<string, Color>;

  constructor(data: D) {
    if (data == null) {
      throw new StyleValidationError([{ message: 'must be object' }]);
    }

    StyleValidator.validate(data);

    // Double cast needed because the null guard narrows D to NonNullable<D>,
    // which TypeScript can't directly cast to StyleDefinition.
    this.#data = structuredClone(data) as unknown as StyleDefinition;
  }

  id(): string | undefined {
    return this.#data.$id;
  }

  schema(): string | undefined {
    return this.#data.$schema;
  }

  comment(): string | undefined {
    return this.#data.$comment;
  }

  meta(): Meta {
    if (!this.#meta) {
      this.#meta = new Meta(this.#data.meta ?? {});
    }

    return this.#meta;
  }

  attributes(): StyleDefinitionAttributes {
    return this.#data.attributes ?? {};
  }

  canvas(): Canvas {
    if (!this.#canvas) {
      this.#canvas = new Canvas(this.#data.canvas);
    }

    return this.#canvas;
  }

  components(): ReadonlyMap<string, Component> {
    if (!this.#components) {
      const map = new Map<string, Component>();

      for (const [name, data] of Object.entries(this.#data.components ?? {})) {
        map.set(name, new Component(data));
      }

      this.#components = map;
    }

    return this.#components;
  }

  colors(): ReadonlyMap<string, Color> {
    if (!this.#colors) {
      const map = new Map<string, Color>();

      for (const [name, data] of Object.entries(this.#data.colors ?? {})) {
        map.set(name, new Color(data));
      }

      this.#colors = map;
    }

    return this.#colors;
  }
}
