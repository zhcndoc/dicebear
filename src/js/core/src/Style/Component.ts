import type { StyleDefinitionComponent } from '../StyleDefinition.js';
import { ComponentTranslate } from './ComponentTranslate.js';
import { ComponentVariant } from './ComponentVariant.js';

/**
 * Read-only view over an entry in a style definition's `components` block.
 */
export class Component {
  #data: StyleDefinitionComponent;
  #translate?: ComponentTranslate;
  #variants?: ReadonlyMap<string, ComponentVariant>;

  constructor(data: StyleDefinitionComponent) {
    this.#data = data;
  }

  /**
   * Returns the component's intrinsic width in canvas coordinates.
   */
  width(): number {
    return this.#data.width;
  }

  /**
   * Returns the component's intrinsic height in canvas coordinates.
   */
  height(): number {
    return this.#data.height;
  }

  /**
   * Returns the probability (0–100) that this component is rendered, defaulting
   * to 100 (always visible).
   */
  probability(): number {
    return this.#data.probability ?? 100;
  }

  /**
   * Returns the rotation range definition, or an empty list when the field
   * is unset.
   */
  rotate(): readonly number[] {
    return this.#data.rotate ?? [];
  }

  /**
   * Returns the scale range definition, or an empty list when the field is
   * unset.
   */
  scale(): readonly number[] {
    return this.#data.scale ?? [];
  }

  /**
   * Returns the translate descriptor, defaulting to an empty object when the
   * style definition omits the field.
   */
  translate(): ComponentTranslate {
    this.#translate ??= new ComponentTranslate(this.#data.translate ?? {});

    return this.#translate;
  }

  /**
   * Returns a name → {@link ComponentVariant} map for all defined variants,
   * built lazily on first access.
   */
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
