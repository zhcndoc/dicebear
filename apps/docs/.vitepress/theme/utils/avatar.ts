import { Style } from '@dicebear/core';
import { kebabCase } from 'change-case';

export function stripHash(hex: string): string {
  return hex.replace(/^#/, '');
}

// Deep-clone an object to strip Vue reactive proxies.
// Required before passing options to Avatar constructor (uses structuredClone).
export function clonePlain<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

const definitionImports: Record<string, () => Promise<{ default: unknown }>> = {
  'adventurer': () => import('@dicebear/definitions/adventurer.json'),
  'adventurer-neutral': () => import('@dicebear/definitions/adventurer-neutral.json'),
  'avataaars': () => import('@dicebear/definitions/avataaars.json'),
  'avataaars-neutral': () => import('@dicebear/definitions/avataaars-neutral.json'),
  'big-ears': () => import('@dicebear/definitions/big-ears.json'),
  'big-ears-neutral': () => import('@dicebear/definitions/big-ears-neutral.json'),
  'big-smile': () => import('@dicebear/definitions/big-smile.json'),
  'bottts': () => import('@dicebear/definitions/bottts.json'),
  'bottts-neutral': () => import('@dicebear/definitions/bottts-neutral.json'),
  'croodles': () => import('@dicebear/definitions/croodles.json'),
  'croodles-neutral': () => import('@dicebear/definitions/croodles-neutral.json'),
  'dylan': () => import('@dicebear/definitions/dylan.json'),
  'fun-emoji': () => import('@dicebear/definitions/fun-emoji.json'),
  'glass': () => import('@dicebear/definitions/glass.json'),
  'icons': () => import('@dicebear/definitions/icons.json'),
  'identicon': () => import('@dicebear/definitions/identicon.json'),
  'initials': () => import('@dicebear/definitions/initials.json'),
  'lorelei': () => import('@dicebear/definitions/lorelei.json'),
  'lorelei-neutral': () => import('@dicebear/definitions/lorelei-neutral.json'),
  'micah': () => import('@dicebear/definitions/micah.json'),
  'miniavs': () => import('@dicebear/definitions/miniavs.json'),
  'notionists': () => import('@dicebear/definitions/notionists.json'),
  'notionists-neutral': () => import('@dicebear/definitions/notionists-neutral.json'),
  'open-peeps': () => import('@dicebear/definitions/open-peeps.json'),
  'personas': () => import('@dicebear/definitions/personas.json'),
  'pixel-art': () => import('@dicebear/definitions/pixel-art.json'),
  'pixel-art-neutral': () => import('@dicebear/definitions/pixel-art-neutral.json'),
  'rings': () => import('@dicebear/definitions/rings.json'),
  'shapes': () => import('@dicebear/definitions/shapes.json'),
  'thumbs': () => import('@dicebear/definitions/thumbs.json'),
  'toon-head': () => import('@dicebear/definitions/toon-head.json'),
};

const styleCache = new Map<string, Style>();

export async function loadAvatarStyle(avatarStyle: string): Promise<Style> {
  const name = kebabCase(avatarStyle);

  const cached = styleCache.get(name);

  if (cached) {
    return cached;
  }

  const loader = definitionImports[name];

  if (!loader) {
    throw new Error(`Avatar style "${avatarStyle}" not found.`);
  }

  const def = await loader();
  const style = new Style(def.default);

  styleCache.set(name, style);

  return style;
}

export function getAvatarApiUrl(
  avatarStyle: string,
  options: Record<string, unknown> = {},
  format: string = 'svg',
): string {
  const qs = Object.entries(options)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        return v.length === 0
          ? `${encodeURIComponent(k)}[]`
          : `${encodeURIComponent(k)}=${v
              .map((c) => encodeURIComponent(c))
              .join(',')}`;
      }

      if (
        typeof v == 'string' ||
        typeof v == 'number' ||
        typeof v == 'boolean'
      ) {
        return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
      }

      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        const pairs = Object.entries(v)
          .map(([vk, vv]) => `${encodeURIComponent(vk)}:${encodeURIComponent(vv)}`)
          .join(',');

        return `${encodeURIComponent(k)}=${pairs}`;
      }

      return `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`;
    })
    .join('&');

  return `https://api.dicebear.com/9.x/${kebabCase(avatarStyle)}/${format}${
    qs ? `?${qs}` : ''
  }`;
}

export function getAvatarApiCommand(
  avatarStyle: string,
  options: Record<string, unknown> = {},
): string {
  const args = Object.entries(options)
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        return `  --${k} ${v
          .map((c) => typeof c === 'string' ? `'${c.replace(/'/g, "'\\''")}'` : String(c))
          .join(' ')}`.trimEnd();
      }

      if (typeof v == 'number' || typeof v == 'boolean') {
        return `  --${k} ${v}`;
      }

      if (typeof v == 'string') {
        return `  --${k} '${v.replace(/'/g, "'\\''")}'`;
      }

      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        const pairs = Object.entries(v)
          .map(([vk, vv]) => `${vk}:${vv}`)
          .join(',');

        return `  --${k} '${pairs}'`;
      }

      return `  --${k} '${String(v)}'`;
    })
    .join(' \\\n');

  return `dicebear ${avatarStyle} .${
    args.length > 0 ? ` \\\n${args}` : ''
  }`.trim();
}

export function getAvatarPropertyPreviewOptions(
  propertyName: string,
  propertyValue: unknown,
  schemaProperties?: Record<string, unknown>,
): Record<string, unknown> {
  if (propertyName === 'seed') {
    return {
      [propertyName]: propertyValue,
    };
  }

  if (propertyName === 'backgroundType') {
    return {
      backgroundColor: ['6d28d9', 'c026d3'],
      [propertyName]: [propertyValue],
    };
  }

  if (propertyName === 'backgroundRotation') {
    return {
      backgroundColor: ['3f3f46', 'd4d4d8'],
      backgroundType: ['gradientLinear'],
      [propertyName]: [propertyValue],
    };
  }

  if (propertyName.match(/Color$/)) {
    const probabilityName = propertyName.replace(/Color$/, 'Probability');
    const disabledProbabilities = getDisabledProbabilities(
      probabilityName,
      schemaProperties,
    );

    return {
      seed: 'JD',
      ...disabledProbabilities,
      [probabilityName]: 100,
      [propertyName]: [propertyValue],
    };
  }

  if (propertyName.match(/Probability$/)) {
    return {
      seed: 'JD',
      [propertyName]: propertyValue,
    };
  }

  if (
    propertyName.match(/OffsetX$/) ||
    propertyName.match(/OffsetY$/) ||
    propertyName.match(/Rotation$/)
  ) {
    return {
      seed: 'JD',
      [propertyName]: [propertyValue],
    };
  }

  const ownProbability = `${propertyName}Probability`;
  const disabledProbabilities = getDisabledProbabilities(
    ownProbability,
    schemaProperties,
  );

  return {
    seed: 'JD',
    ...disabledProbabilities,
    [ownProbability]: 100,
    [propertyName]:
      typeof propertyValue === 'string' ? [propertyValue] : propertyValue,
  };
}

// Parses URL query params into a validated options object for the playground store.
// Only keys present in the descriptor are accepted. Values are type-checked and
// bounds-checked against the descriptor definition.
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export function parsePlaygroundParams(
  searchParams: URLSearchParams,
  descriptor: Record<string, any>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, raw] of searchParams) {
    if (key === 'style' || key === 'seed') continue;
    if (DANGEROUS_KEYS.has(key)) continue;

    if (!Object.prototype.hasOwnProperty.call(descriptor, key)) continue;

    const field = descriptor[key];

    const parsed = parseParamValue(raw, field);

    if (parsed !== undefined) {
      result[key] = parsed;
    }
  }

  return result;
}

function parseParamValue(raw: string, field: any): unknown {
  switch (field.type) {
    case 'string':
      return raw;

    case 'boolean':
      return raw === 'true';

    case 'number': {
      const n = Number(raw);

      if (isNaN(n)) return undefined;
      if (field.min !== undefined && n < field.min) return undefined;
      if (field.max !== undefined && n > field.max) return undefined;

      return n;
    }

    case 'range': {
      if (raw.includes(',')) {
        const parts = raw.split(',').map(Number);

        if (parts.length !== 2 || parts.some(isNaN)) return undefined;
        if (field.min !== undefined && parts.some((p: number) => p < field.min)) return undefined;
        if (field.max !== undefined && parts.some((p: number) => p > field.max)) return undefined;

        return parts;
      }

      const n = Number(raw);

      if (isNaN(n)) return undefined;
      if (field.min !== undefined && n < field.min) return undefined;
      if (field.max !== undefined && n > field.max) return undefined;

      return n;
    }

    case 'enum': {
      if (field.weighted && raw.includes(':')) {
        // Weighted: "variant01:2,variant03:1"
        const obj: Record<string, number> = {};

        for (const pair of raw.split(',')) {
          const [k, v] = pair.split(':');

          if (!k || DANGEROUS_KEYS.has(k)) continue;

          const weight = v !== undefined ? Number(v) : 1;

          if (isNaN(weight)) continue;
          if (field.values && !field.values.includes(k)) continue;

          obj[k] = weight;
        }

        return Object.keys(obj).length > 0 ? obj : undefined;
      }

      if (raw.includes(',')) {
        // Array: "variant01,variant03"
        const values = raw.split(',');

        if (field.values) {
          const valid = values.filter((v: string) => field.values.includes(v));

          return valid.length > 0 ? valid : undefined;
        }

        return values;
      }

      // Single value
      if (field.values && !field.values.includes(raw)) return undefined;

      return raw;
    }

    case 'color': {
      if (raw === '') return [];

      const colors = raw.split(',').filter((c: string) =>
        /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{4}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(c)
      );

      return colors.length > 0 ? colors : undefined;
    }

    default:
      return undefined;
  }
}

// Serializes playground options to URL search params (inverse of parsePlaygroundParams).
export function serializePlaygroundParams(
  styleName: string,
  seed: string,
  options: Record<string, unknown>,
): URLSearchParams {
  const params = new URLSearchParams();

  params.set('style', kebabCase(styleName));

  if (seed) {
    params.set('seed', seed);
  }

  for (const [key, value] of Object.entries(options)) {
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      params.set(key, value.join(','));
    } else if (typeof value === 'object' && value !== null) {
      const pairs = Object.entries(value)
        .map(([vk, vv]) => `${vk}:${vv}`)
        .join(',');

      params.set(key, pairs);
    } else {
      params.set(key, String(value));
    }
  }

  return params;
}

function getDisabledProbabilities(
  excludeKey: string,
  schemaProperties?: Record<string, unknown>,
): Record<string, number> {
  if (!schemaProperties) return {};

  const result: Record<string, number> = {};

  for (const [key, value] of Object.entries(schemaProperties)) {
    if (key.endsWith('Probability') && key !== excludeKey) {
      const def = (value as Record<string, unknown>)?.default;
      if (def !== 100) {
        result[key] = 0;
      }
    }
  }

  return result;
}
