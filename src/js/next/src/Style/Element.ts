import type { DefinitionAttributes } from '../types.js';

export type VariableName = 'initial' | 'initials' | 'fontWeight' | 'fontFamily';

export interface VariableReference {
  readonly type: 'variable';
  readonly value: VariableName;
}

export type ElementValue = string | VariableReference;

export type ElementType = 'element' | 'text' | 'component';

export interface DefinitionElement {
  readonly type: ElementType;
  readonly name?: string;
  readonly value?: ElementValue;
  readonly attributes?: DefinitionAttributes;
  readonly children?: readonly DefinitionElement[];
}

export class Element {
  #data: DefinitionElement;
  #children?: readonly Element[];

  constructor(data: DefinitionElement) {
    this.#data = data;
  }

  type(): ElementType {
    return this.#data.type;
  }

  name(): string | undefined {
    return this.#data.name;
  }

  value(): ElementValue | undefined {
    return this.#data.value;
  }

  attributes(): DefinitionAttributes | undefined {
    return this.#data.attributes;
  }

  children(): readonly Element[] {
    this.#children ??= (this.#data.children ?? []).map(
      (child) => new Element(child),
    );

    return this.#children;
  }
}
