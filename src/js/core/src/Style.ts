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
    this.#meta ??= new Meta(this.#data.meta ?? {});

    return this.#meta;
  }

  attributes(): StyleDefinitionAttributes {
    return structuredClone(this.#data.attributes ?? {});
  }

  canvas(): Canvas {
    this.#canvas ??= new Canvas(this.#data.canvas);

    return this.#canvas;
  }

  components(): ReadonlyMap<string, Component> {
    this.#components ??= new Map(
      Object.entries(this.#data.components ?? {}).map(([name, data]) => [
        name,
        new Component(data),
      ]),
    );

    return this.#components;
  }

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
