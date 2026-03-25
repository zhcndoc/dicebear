import { StyleValidator } from './Validator/StyleValidator.js';
import type { DefinitionAttributes } from './types.js';
import type { DefinitionMeta } from './Style/Meta.js';
import type { DefinitionCanvas } from './Style/Canvas.js';
import type { DefinitionComponent } from './Style/Component.js';
import type { DefinitionColor } from './Style/Color.js';
import { Meta } from './Style/Meta.js';
import { Canvas } from './Style/Canvas.js';
import { Component } from './Style/Component.js';
import { Color } from './Style/Color.js';

export interface Definition {
  readonly $schema?: string;
  readonly $comment?: string;
  readonly meta?: DefinitionMeta;
  readonly attributes?: DefinitionAttributes;
  readonly canvas: DefinitionCanvas;
  readonly components?: Readonly<Record<string, DefinitionComponent>>;
  readonly colors?: Readonly<Record<string, DefinitionColor>>;
}

export class Style {
  #data: Definition;
  #meta?: Meta;
  #canvas?: Canvas;
  #components?: ReadonlyMap<string, Component>;
  #colors?: ReadonlyMap<string, Color>;

  constructor(data: unknown, validate = true) {
    if (validate) {
      StyleValidator.validate(data);
    }

    this.#data = data as Definition;
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

  attributes(): DefinitionAttributes {
    return this.#data.attributes ?? {};
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
