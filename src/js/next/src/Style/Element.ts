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

  get type(): ElementType {
    return this.#data.type;
  }

  get name(): string | undefined {
    return this.#data.name;
  }

  get value(): ElementValue | undefined {
    return this.#data.value;
  }

  get attributes(): DefinitionAttributes | undefined {
    return this.#data.attributes;
  }

  get children(): readonly Element[] {
    this.#children ??= (this.#data.children ?? []).map((child) => new Element(child));

    return this.#children;
  }
}
