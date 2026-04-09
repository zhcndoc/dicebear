import { Style } from '@dicebear/core';
import { kebabCase } from 'change-case';

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
const definitionRawCache = new Map<string, object>();
const variableResultCache = new Map<string, Map<string, boolean>>();
const pendingCustomStyles = new Map<string, PromiseWithResolvers<Style>>();
let customStylesFlushed = false;

export function registerCustomStyle(key: string, definition: object): Style {
  const style = new Style(definition);

  styleCache.set(key, style);
  definitionRawCache.set(key, definition);
  variableResultCache.delete(key);

  const pending = pendingCustomStyles.get(key);

  if (pending) {
    pending.resolve(style);
    pendingCustomStyles.delete(key);
  }

  return style;
}

export function flushPendingCustomStyles(): void {
  for (const [key, { reject }] of pendingCustomStyles) {
    reject(new Error(`Custom style "${key}" not found in storage.`));
  }

  pendingCustomStyles.clear();
  customStylesFlushed = true;
}

export function unregisterCustomStyle(key: string): void {
  styleCache.delete(key);
  definitionRawCache.delete(key);
  variableResultCache.delete(key);
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

  if (avatarStyle.startsWith('custom:')) {
    if (customStylesFlushed) {
      throw new Error(`Custom style "${avatarStyle}" not found.`);
    }

    const existing = pendingCustomStyles.get(avatarStyle);

    if (existing) {
      return existing.promise;
    }

    const deferred = Promise.withResolvers<Style>();

    pendingCustomStyles.set(avatarStyle, deferred);

    return deferred.promise;
  }

  const loader = definitionImports[name];

  if (!loader) {
    throw new Error(`Avatar style "${avatarStyle}" not found.`);
  }

  const def = await loader();
  const raw = def.default as object;

  definitionRawCache.set(name, raw);

  const style = new Style(raw);

  styleCache.set(name, style);

  return style;
}

function scanForVariable(obj: unknown, variableName: string): boolean {
  if (typeof obj !== 'object' || obj === null) return false;

  const record = obj as Record<string, unknown>;

  if (record.type === 'variable' && record.value === variableName) return true;

  for (const val of Object.values(record)) {
    if (scanForVariable(val, variableName)) return true;
  }

  return false;
}

export function styleUsesVariable(avatarStyle: string, variableName: string): boolean {
  const name = kebabCase(avatarStyle);
  const key = definitionRawCache.has(name) ? name : avatarStyle;
  const raw = definitionRawCache.get(key);

  if (!raw) return false;

  let perStyle = variableResultCache.get(key);

  if (!perStyle) {
    perStyle = new Map();
    variableResultCache.set(key, perStyle);
  }

  if (perStyle.has(variableName)) return perStyle.get(variableName)!;

  const result = scanForVariable(raw, variableName);

  perStyle.set(variableName, result);

  return result;
}
