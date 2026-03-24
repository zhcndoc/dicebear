export interface ColorReference {
  readonly type: 'color';
  readonly value: string;
}

export type ColorAttributeValue = string | ColorReference;

export type PaintAttributeValue = ColorAttributeValue;

export interface DefinitionAttributes {
  readonly 'color'?: ColorAttributeValue;
  readonly 'flood-color'?: ColorAttributeValue;
  readonly 'lighting-color'?: ColorAttributeValue;
  readonly 'stop-color'?: ColorAttributeValue;
  readonly 'fill'?: PaintAttributeValue;
  readonly 'stroke'?: PaintAttributeValue;
  readonly [key: string]: string | ColorReference | undefined;
}
