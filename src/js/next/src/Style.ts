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
  readonly $id?: string;
  readonly $schema?: string;
  readonly $comment?: string;
  readonly meta?: DefinitionMeta;
  readonly attributes?: DefinitionAttributes;
  readonly canvas: DefinitionCanvas;
  readonly components?: Readonly<Record<string, DefinitionComponent>>;
  readonly colors?: Readonly<Record<string, DefinitionColor>>;
}

export class Style<D = unknown> {
  #data: Definition;
  #meta?: Meta;
  #canvas?: Canvas;
  #components?: ReadonlyMap<string, Component>;
  #colors?: ReadonlyMap<string, Color>;

  constructor(data: D) {
    StyleValidator.validate(data);

    this.#data = structuredClone(data) as Definition;
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

  attributes(): DefinitionAttributes {
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
