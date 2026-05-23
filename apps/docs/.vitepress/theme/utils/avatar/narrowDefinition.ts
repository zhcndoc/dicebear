import type { StyleDefinition } from '@dicebear/core';
import { isAlias, resolveBase } from './combinationCount';

type MutableDefinition = StyleDefinition & {
  components?: Record<string, any>;
  colors?: Record<string, any>;
};

/**
 * Produces a deep clone of `definition` with the user's playground option
 * choices applied — restricting variant lists, probability, and color
 * palettes so that `computeCount` reflects the narrowed space.
 *
 * Only options whose key appears in `options` (i.e. that the user actually
 * set) are applied. Canvas-level transforms (flip, rotate, scale,
 * borderRadius, translateX/Y) and presentation options (fontFamily, *Fill,
 * *FillStops, *Angle, seed, size, …) do not change the cardinality and are
 * therefore ignored here, matching what `combinationCount` already counts.
 */
export function narrowDefinition(
  definition: StyleDefinition,
  options: Record<string, unknown>,
): StyleDefinition {
  const next = structuredClone(definition) as MutableDefinition;
  const entries = Object.entries(options).filter(([, v]) => v !== undefined);

  // Probability first, then variants — so an empty-variant override can
  // unconditionally pin probability = 0 (component always invisible)
  // without being clobbered by a separately-set probability.
  for (const [key, value] of entries) {
    if (key.endsWith('Probability')) {
      applyProbability(next, key.slice(0, -'Probability'.length), value);
    }
  }

  for (const [key, value] of entries) {
    if (key.endsWith('Variant')) {
      applyVariantNarrowing(next, key.slice(0, -'Variant'.length), value);
    } else if (key.endsWith('Color')) {
      applyColorPalette(next, key.slice(0, -'Color'.length), value);
    }
  }

  return next;
}

function applyVariantNarrowing(
  definition: MutableDefinition,
  componentName: string,
  value: unknown,
): void {
  const base = resolveBase(definition, componentName);

  if (!base || !base.component.variants) {
    return;
  }

  const baseComponent = definition.components?.[base.name];

  if (!baseComponent || isAlias(baseComponent)) {
    return;
  }

  let active: Map<string, number> | undefined;

  if (Array.isArray(value)) {
    active = new Map();

    for (const entry of value) {
      if (typeof entry !== 'string') continue;

      // Strip optional weight prefix like "2:variantName" (Prng.weightedPick syntax).
      const colon = entry.indexOf(':');
      const name = colon >= 0 ? entry.slice(colon + 1) : entry;
      const weight = colon >= 0 ? Number(entry.slice(0, colon)) : 1;

      if (name in (base.component.variants ?? {})) {
        active.set(name, Number.isFinite(weight) ? Math.max(weight, 0) : 1);
      }
    }
  } else if (value && typeof value === 'object') {
    active = new Map();

    for (const [name, weight] of Object.entries(
      value as Record<string, unknown>,
    )) {
      if (name in (base.component.variants ?? {})) {
        const w = typeof weight === 'number' ? weight : 1;
        active.set(name, Math.max(w, 0));
      }
    }
  }

  if (!active) {
    return;
  }

  // Empty selection: renderer's weightedPick returns undefined for `[]`
  // (Prng.ts:57-59), so the component renders nothing — exactly one outcome.
  // Force probability = 0 so `outcomes()` collapses to 1n regardless of any
  // user-set probability.
  if (active.size === 0) {
    baseComponent.probability = 0;
    return;
  }

  const narrowed: Record<string, any> = {};

  for (const [name, weight] of active) {
    const original = base.component.variants![name];
    narrowed[name] = { ...original, weight };
  }

  baseComponent.variants = narrowed;
}

function applyProbability(
  definition: MutableDefinition,
  componentName: string,
  value: unknown,
): void {
  const base = resolveBase(definition, componentName);

  if (!base) {
    return;
  }

  const baseComponent = definition.components?.[base.name];

  if (!baseComponent || isAlias(baseComponent)) {
    return;
  }

  let probability: number | undefined;

  if (typeof value === 'number') {
    probability = value;
  } else if (Array.isArray(value) && value.length === 2) {
    const [a, b] = value;

    if (typeof a === 'number' && typeof b === 'number') {
      // For counting purposes only the "can be invisible" bit matters:
      // if both endpoints hit the same extreme, honor it; otherwise the
      // range straddles non-100 so the +1-invisible branch applies.
      if (a === 100 && b === 100) probability = 100;
      else if (a === 0 && b === 0) probability = 0;
      else probability = 99;
    }
  }

  if (probability === undefined) {
    return;
  }

  baseComponent.probability = Math.max(0, Math.min(100, probability));
}

function applyColorPalette(
  definition: MutableDefinition,
  colorName: string,
  value: unknown,
): void {
  const group = definition.colors?.[colorName];

  if (!group) {
    return;
  }

  let values: string[] | undefined;

  if (Array.isArray(value)) {
    values = value.filter((v): v is string => typeof v === 'string');
  } else if (typeof value === 'string') {
    values = [value];
  }

  if (!values || values.length === 0) {
    return;
  }

  group.values = values;
}
