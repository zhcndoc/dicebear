import type { StyleDefinitionComponent } from '../StyleDefinition.js';
import { ComponentTranslate } from './ComponentTranslate.js';
import { ComponentVariant } from './ComponentVariant.js';

export class Component {
  #data: StyleDefinitionComponent;
  #translate?: ComponentTranslate;
  #variants?: ReadonlyMap<string, ComponentVariant>;

  constructor(data: StyleDefinitionComponent) {
    this.#data = data;
  }

  width(): number {
    return this.#data.width;
  }

  height(): number {
    return this.#data.height;
  }

  probability(): number {
    return this.#data.probability ?? 100;
  }

  rotate(): readonly number[] {
    return this.#data.rotate ?? [];
  }

  translate(): ComponentTranslate {
    this.#translate ??= new ComponentTranslate(this.#data.translate ?? {});

    return this.#translate;
  }

  variants(): ReadonlyMap<string, ComponentVariant> {
    this.#variants ??= new Map(
      Object.entries(this.#data.variants).map(([name, data]) => [
        name,
        new ComponentVariant(data),
      ]),
    );

    return this.#variants;
  }
}
