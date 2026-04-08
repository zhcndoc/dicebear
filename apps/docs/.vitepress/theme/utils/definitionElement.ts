export interface DefinitionElement {
  type(): string;
  value(): unknown;
  attributes(): Record<string, unknown> | undefined;
  children(): readonly DefinitionElement[];
}

export function isColorAttr(val: unknown): val is { type: 'color'; value: string } {
  if (!val || typeof val !== 'object') return false;

  const attr = val as Record<string, unknown>;

  return attr.type === 'color' && typeof attr.value === 'string';
}
