export type VariableName = 'initial' | 'initials' | 'fontWeight' | 'fontFamily';

export interface VariableReference {
  readonly type: 'variable';
  readonly value: VariableName;
}

export interface ColorReference {
  readonly type: 'color';
  readonly value: string;
}

export type ColorAttributeValue = string | ColorReference;

export type PaintAttributeValue = ColorAttributeValue;

export interface DefinitionAttributes {
  readonly color?: ColorAttributeValue;
  readonly 'flood-color'?: ColorAttributeValue;
  readonly 'lighting-color'?: ColorAttributeValue;
  readonly 'stop-color'?: ColorAttributeValue;
  readonly fill?: PaintAttributeValue;
  readonly stroke?: PaintAttributeValue;
  readonly 'font-family'?: string | VariableReference;
  readonly 'font-weight'?: string | VariableReference;
  readonly [key: string]: string | ColorReference | VariableReference | undefined;
}
