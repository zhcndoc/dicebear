import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import type { ConfigStyleOptions } from '@/types';

const defaultBackgroundColors = [
  // https://oklch-palette.vercel.app/#76,0.12,0,100
  'fff1f5',
  'ffdde6',
  'ffc8d8',
  'ffb3c9',
  'fc9ebb',

  // https://oklch-palette.vercel.app/#76,0.12,30,100
  'fff2ef',
  'ffdfd9',
  'ffcbc2',
  'ffb7ab',
  'ffa293',

  // https://oklch-palette.vercel.app/#76,0.12,60,100
  'fff3e9',
  'ffe1c9',
  'ffcfa8',
  'ffbc84',
  'f5ac6f',

  // https://oklch-palette.vercel.app/#76,0.12,90,100
  'fff5d9',
  'ffe5a0',
  'f7d67c',
  'e9c96e',
  'dbbb60',

  // https://oklch-palette.vercel.app/#76,0.12,120,100
  'edffb9',
  'ddf399',
  'cfe58c',
  'c2d77e',
  'b5ca71',

  // https://oklch-palette.vercel.app/#76,0.12,150,100
  'dfffe4',
  'aefebe',
  'a0efb1',
  'a0efb1',
  '85d496',

  // https://oklch-palette.vercel.app/#76,0.12,180,100
  'd8fff6',
  '91ffea',
  '77f3dc',
  '68e5cf',
  '59d7c1',

  // https://oklch-palette.vercel.app/#76,0.12,210,100
  'e2faff',
  'b6f4ff',
  '80ecff',
  '5fe0f6',
  '4fd3e8',

  // https://oklch-palette.vercel.app/#76,0.12,240,100
  'ecf7ff',
  'd1ebff',
  'b5e0ff',
  '97d4ff',
  '77c8ff',

  // https://oklch-palette.vercel.app/#76,0.12,270,100
  'f1f5ff',
  'dee7ff',
  'cbd9ff',
  'b8caff',
  'a5bcff',

  // https://oklch-palette.vercel.app/#76,0.12,300,100
  'f7f3ff',
  'ebe2ff',
  'e0d0ff',
  'd5bfff',
  'caadfe',

  // https://oklch-palette.vercel.app/#76,0.12,330,100
  'fff0fd',
  'ffdafa',
  'ffc2f9',
  'f7b0f0',
  'f7b0f0',
];

export default function getSchemaOptions(
  schema: JSONSchema7,
): ConfigStyleOptions {
  const result: ConfigStyleOptions = {};
  const properties: Record<string, JSONSchema7Definition> = {
    backgroundColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
    },
    ...schema.properties,
  };

  for (const key in properties) {
    if (false === Object.prototype.hasOwnProperty.call(properties, key)) {
      continue;
    }

    if (key === 'style') {
      continue;
    }

    const property = properties[key];

    if (typeof property === 'boolean') {
      continue;
    }

    const isColor = !!key.match(/Color$/);
    const isArray = property.type === 'array';
    const isBackgroundColor = key === 'backgroundColor';
    const probability = properties[`${key}Probability`];
    const hasProbability = typeof probability === 'object';

    const values = new Set<string>();

    if (hasProbability) {
      values.add('');
    }

    if (property.enum) {
      for (const value of property.enum) {
        if (typeof value === 'string') {
          values.add(value);
        }
      }
    }

    if (property.default && Array.isArray(property.default)) {
      for (const value of property.default) {
        if (typeof value === 'string') {
          values.add(value);
        }
      }
    }

    if (
      typeof property.items === 'object' &&
      !Array.isArray(property.items) &&
      property.items.enum
    ) {
      for (const value of property.items.enum) {
        if (typeof value === 'string') {
          values.add(value);
        }
      }
    }

    if (values.size <= 1) {
      if (!isBackgroundColor) {
        continue;
      }

      for (const fallbackBackgroundColor of defaultBackgroundColors) {
        values.add(fallbackBackgroundColor);
      }
    }

    if (isBackgroundColor) {
      values.add('ffffff');
      values.add('transparent');
    }

    result[key] = {
      values: Array.from(values.values()),
      isColor,
      isArray,
      hasProbability,
      probability: hasProbability ? (probability.default as number) : 100,
    };
  }

  return result;
}
