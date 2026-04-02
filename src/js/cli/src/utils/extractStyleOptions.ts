import { Style, OptionsDescriptor } from '@dicebear/core';

// Extracts only the style-relevant options from the yargs argv object,
// filtering out CLI-specific keys (_, $0, outputPath, count, format, etc.).
export function extractStyleOptions(
  argv: Record<string, unknown>,
  style: Style,
): Record<string, unknown> {
  const descriptor = new OptionsDescriptor(style).toJSON();
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(descriptor)) {
    if (key in argv && argv[key] !== undefined) {
      result[key] = argv[key];
    }
  }

  return result;
}
