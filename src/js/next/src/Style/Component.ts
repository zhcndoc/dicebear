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
    if (!this.#translate) {
      this.#translate = new ComponentTranslate(this.#data.translate ?? {});
    }

    return this.#translate;
  }

  variants(): ReadonlyMap<string, ComponentVariant> {
    if (!this.#variants) {
      const map = new Map<string, ComponentVariant>();

      for (const [name, data] of Object.entries(this.#data.variants)) {
        map.set(name, new ComponentVariant(data));
      }

      this.#variants = map;
    }

    return this.#variants;
  }
}
