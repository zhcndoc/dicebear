import { Style } from '@dicebear/core';
import { kebabCase } from 'change-case';
import { escapeShellArg } from './escape';

export function stripHash(hex: string): string {
  return hex.replace(/^#/, '');
}

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

export function registerCustomStyle(key: string, definition: object): Style {
  const style = new Style(definition);

  styleCache.set(key, style);

  return style;
}

export function unregisterCustomStyle(key: string): void {
  styleCache.delete(key);
}

export async function loadAvatarStyle(avatarStyle: string): Promise<Style> {
  const cached = styleCache.get(avatarStyle);

  if (cached) {
    return cached;
  }

  const name = kebabCase(avatarStyle);
  const cachedByName = styleCache.get(name);

  if (cachedByName) {
    return cachedByName;
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

async function readAllBytes(readable: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  const reader = readable.getReader();

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const result = new Uint8Array(
    chunks.reduce((sum, c) => sum + c.length, 0),
  );

  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

export async function compressFragment(data: object): Promise<string> {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);

  const cs = new CompressionStream('deflate-raw');
  const writer = cs.writable.getWriter();
  writer.write(bytes);
  writer.close();

  const compressed = await readAllBytes(cs.readable);
  const base64 = btoa(String.fromCharCode(...compressed));

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function decompressFragment(encoded: string): Promise<object> {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

  const ds = new DecompressionStream('deflate-raw');
  const writer = ds.writable.getWriter();
  writer.write(bytes);
  writer.close();

  const decompressed = await readAllBytes(ds.readable);
  const json = new TextDecoder().decode(decompressed);

  return JSON.parse(json);
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

function shellQuote(value: string): string {
  return `'${escapeShellArg(value)}'`;
}

export function getAvatarApiCommand(
  avatarStyle: string,
  options: Record<string, unknown> = {},
): string {
  const args = Object.entries(options)
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        return `  --${k} ${v
          .map((c) => shellQuote(String(c)))
          .join(' ')}`.trimEnd();
      }

      if (typeof v == 'number' || typeof v == 'boolean') {
        return `  --${k} ${v}`;
      }

      if (typeof v == 'string') {
        return `  --${k} ${shellQuote(v)}`;
      }

      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        const pairs = Object.entries(v)
          .map(([vk, vv]) => shellQuote(`${vk}:${vv}`))
          .join(' ');

        return `  --${k} ${pairs}`;
      }

      return `  --${k} ${shellQuote(String(v))}`;
    })
    .join(' \\\n');

  return `dicebear ${shellQuote(avatarStyle)} .${
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
