import { Style, OptionsDescriptor } from '@dicebear/core';
import type { Options } from 'yargs';

export function getStyleCommandOptions(style: Style): Record<string, Options> {
  const descriptor = new OptionsDescriptor(style).toJSON();
  const result: Record<string, Options> = {
    count: {
      description: 'Defines how many avatars to create.',
      type: 'number',
      default: 1,
    },
    format: {
      type: 'string',
      choices: ['svg', 'png', 'jpg', 'jpeg', 'webp', 'avif', 'json'],
      default: 'svg',
    },
    exif: {
      description: 'Include Exif Metadata',
      type: 'boolean',
      default: false,
    },
    json: {
      description: 'Save JSON file in addition to image file',
      type: 'boolean',
      default: false,
    },
  };

  for (const [key, field] of Object.entries(descriptor)) {
    const option: Options = {};

    switch (field.type) {
      case 'string':
        option.type = 'string';
        break;
      case 'number':
      case 'range':
        option.type = 'number';
        break;
      case 'boolean':
        option.type = 'boolean';
        break;
      case 'enum':
        option.type = 'string';
        option.choices = field.values as string[];
        break;
      case 'color':
        option.type = 'string';
        break;
    }

    result[key] = option;
  }

  return result;
}
