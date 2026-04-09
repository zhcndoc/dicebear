export function stripHash(hex: string): string {
  return hex.replace(/^#/, '');
}

export const fallbackColors = ['ff8aab', 'ffbe47', '5bc971', '4da6ff', 'a67df5'] as const;

export function padColors(values: readonly string[], min = 4): string[] {
  if (values.length >= min) return [...values];

  const pool = fallbackColors.filter((c) => !values.includes(c));

  return [...values, ...pool.slice(0, min - values.length)];
}

export function resolveColors(
  colorName: string,
  styleColors?: Readonly<Record<string, readonly string[]>>,
): readonly string[] {
  const values = styleColors?.[colorName];

  if (values && values.length > 0) return values;

  return fallbackColors;
}
