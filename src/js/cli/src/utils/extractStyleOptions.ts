import { Style, OptionsDescriptor } from '@dicebear/core';

// Parses ['variant01:2', 'variant03:1'] (array from yargs) into { variant01: 2, variant03: 1 }
function parseWeightedValue(value: string[]): Record<string, number> {
  const result: Record<string, number> = {};

  for (const pair of value) {
    const [key, weight] = pair.split(':');

    if (key) {
      result[key.trim()] = weight !== undefined ? Number(weight) : 1;
    }
  }

  return result;
}

// Parses "10,50" into [10, 50] for range values
function parseRangeValue(value: unknown): unknown {
  if (typeof value === 'string' && value.includes(',')) {
    const parts = value.split(',').map(Number);

    if (parts.length === 2 && parts.every((n) => !isNaN(n))) {
      return parts;
    }
  }

  return value;
}

// Extracts only the style-relevant options from the yargs argv object,
// filtering out CLI-specific keys (_, $0, outputPath, count, format, etc.).
export function extractStyleOptions(
  argv: Record<string, unknown>,
  style: Style,
): Record<string, unknown> {
  const descriptor = new OptionsDescriptor(style).toJSON();
  const result: Record<string, unknown> = {};

  for (const [key, field] of Object.entries(descriptor)) {
    if (!(key in argv) || argv[key] === undefined) {
      continue;
    }

    let value: unknown = argv[key];

    if (field.type === 'enum' && field.weighted && Array.isArray(value)) {
      value = parseWeightedValue(value);
    }

    if (field.type === 'range') {
      value = parseRangeValue(value);
    }

    result[key] = value as Record<string, unknown>[string];
  }

  return result;
}
