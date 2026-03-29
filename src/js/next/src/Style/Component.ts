import type { DefinitionComponentTranslate } from './ComponentTranslate.js';
import type { DefinitionComponentVariant } from './ComponentVariant.js';
import { ComponentTranslate } from './ComponentTranslate.js';
import { ComponentVariant } from './ComponentVariant.js';

export interface DefinitionComponent {
  readonly width: number;
  readonly height: number;
  readonly probability?: number;
  readonly rotate?: readonly number[];
  readonly translate?: DefinitionComponentTranslate;
  readonly variants: Readonly<Record<string, DefinitionComponentVariant>>;
}

export class Component {
  #data: DefinitionComponent;
  #translate?: ComponentTranslate;
  #variants?: ReadonlyMap<string, ComponentVariant>;

  constructor(data: DefinitionComponent) {
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
