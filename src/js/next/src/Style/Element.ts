import type {
  StyleDefinitionElement,
  StyleDefinitionElementValue,
  StyleDefinitionElementType,
  StyleDefinitionAttributes,
} from '../StyleDefinition.js';

export class Element {
  #data: StyleDefinitionElement;
  #children?: readonly Element[];

  constructor(data: StyleDefinitionElement) {
    this.#data = data;
  }

  type(): StyleDefinitionElementType {
    return this.#data.type;
  }

  name(): string | undefined {
    return this.#data.name;
  }

  value(): StyleDefinitionElementValue | undefined {
    return this.#data.value;
  }

  attributes(): StyleDefinitionAttributes | undefined {
    return this.#data.attributes;
  }

  children(): readonly Element[] {
    this.#children ??= (this.#data.children ?? []).map(
      (child) => new Element(child),
    );

    return this.#children;
  }
}
