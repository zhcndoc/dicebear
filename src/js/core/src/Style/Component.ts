import type {
  StyleDefinitionComponent,
  StyleDefinitionComponentBase,
} from '../StyleDefinition.js';
import { ComponentTranslate } from './ComponentTranslate.js';
import { ComponentVariant } from './ComponentVariant.js';

/**
 * Read-only view over an entry in a style definition's `components` block.
 *
 * An entry is either a base component with its own dimensions and variants
 * or an alias declared via `extends`. Aliases inherit `width`, `height`,
 * and `variants` from the source component; per-instance overrides for
 * `probability`, `rotate`, `scale`, and `translate` fall through to the
 * source when omitted on the alias.
 */
export class Component {
  #data: StyleDefinitionComponent;
  #source?: Component;
  #translate?: ComponentTranslate;
  #variants?: ReadonlyMap<string, ComponentVariant>;

  constructor(data: StyleDefinitionComponent, source?: Component) {
    this.#data = data;
    this.#source = source;
  }

  /**
   * Returns the source component name when this entry is an alias, or
   * `undefined` for a base component.
   */
  extendsName(): string | undefined {
    return 'extends' in this.#data ? this.#data.extends : undefined;
  }

  /**
   * Returns the component's intrinsic width in canvas coordinates. For
   * aliases the source component's width is returned.
   */
  width(): number {
    return this.#source ? this.#source.width() : this.#asBase().width;
  }

  /**
   * Returns the component's intrinsic height in canvas coordinates. For
   * aliases the source component's height is returned.
   */
  height(): number {
    return this.#source ? this.#source.height() : this.#asBase().height;
  }

  /**
   * Returns the probability (0–100) that this component is rendered. Falls
   * back to the source component's probability for aliases when the alias
   * does not set its own override; defaults to 100 (always visible).
   */
  probability(): number {
    if (this.#data.probability !== undefined) {
      return this.#data.probability;
    }

    return this.#source ? this.#source.probability() : 100;
  }

  /**
   * Returns the rotation range definition. Falls back to the source
   * component's range for aliases when the alias does not set its own
   * override; returns an empty list when neither is set.
   */
  rotate(): readonly number[] {
    if (this.#data.rotate !== undefined) {
      return this.#data.rotate;
    }

    return this.#source ? this.#source.rotate() : [];
  }

  /**
   * Returns the scale range definition. Falls back to the source
   * component's range for aliases when the alias does not set its own
   * override; returns an empty list when neither is set.
   */
  scale(): readonly number[] {
    if (this.#data.scale !== undefined) {
      return this.#data.scale;
    }

    return this.#source ? this.#source.scale() : [];
  }

  /**
   * Returns the translate descriptor. Falls back to the source component's
   * descriptor for aliases when the alias does not set its own override.
   */
  translate(): ComponentTranslate {
    if (this.#data.translate !== undefined) {
      this.#translate ??= new ComponentTranslate(this.#data.translate);

      return this.#translate;
    }

    if (this.#source) {
      return this.#source.translate();
    }

    this.#translate ??= new ComponentTranslate({});

    return this.#translate;
  }

  /**
   * Returns a name → {@link ComponentVariant} map for all defined variants.
   * Aliases delegate to the source component's variants.
   */
  variants(): ReadonlyMap<string, ComponentVariant> {
    if (this.#source) {
      return this.#source.variants();
    }

    this.#variants ??= new Map(
      Object.entries(this.#asBase().variants).map(([name, data]) => [
        name,
        new ComponentVariant(data),
      ]),
    );

    return this.#variants;
  }

  #asBase(): StyleDefinitionComponentBase {
    return this.#data as StyleDefinitionComponentBase;
  }
}
