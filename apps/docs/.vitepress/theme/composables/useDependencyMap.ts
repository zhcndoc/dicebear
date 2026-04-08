import { computed, type Ref } from 'vue';
import type { Style } from '@dicebear/core';

export type ComponentDependency = {
  parentName: string;
  parentVariant: string;
  parentColors: { colorKey: string; defaultCount: number }[];
};

export type ColorComponentRef = {
  componentName: string;
  variantName: string;
};

interface DefinitionElement {
  type(): string;
  value(): unknown;
  attributes(): Record<string, unknown> | undefined;
  children(): readonly DefinitionElement[];
}

export function useDependencyMap(loadedStyle: Ref<Style | null>) {
  const analyzed = computed(() => {
    if (!loadedStyle.value) {
      return {
        deps: {} as Record<string, ComponentDependency>,
        colorMap: {} as Record<string, ColorComponentRef[]>,
      };
    }

    const deps: Record<string, ComponentDependency> = {};
    const variantColorRefs = new Map<string, Set<string>>();
    const colorRefs = new Map<string, ColorComponentRef[]>();

    // Initialize with all known colors so every color has an entry
    for (const colorName of loadedStyle.value.colors().keys()) {
      colorRefs.set(colorName, []);
    }

    // Track which (color, component) pairs we've already recorded
    // so we only store the first variant per component for each color
    const seen = new Set<string>();

    for (const [compName, component] of loadedStyle.value.components()) {
      for (const [variantName, variant] of component.variants()) {
        const variantColors = new Set<string>();

        collectComponentRefs(variant.elements(), compName, variantName, deps, variantColors);

        if (variantColors.size > 0) {
          variantColorRefs.set(`${compName}/${variantName}`, variantColors);
        }

        // Build color → component+variant map
        for (const colorName of variantColors) {
          if (!colorRefs.has(colorName)) {
            colorRefs.set(colorName, []);
          }

          const key = `${colorName}:${compName}`;

          if (!seen.has(key)) {
            seen.add(key);
            colorRefs.get(colorName)!.push({ componentName: compName, variantName });
          }
        }
      }
    }

    for (const dep of Object.values(deps)) {
      const refs = variantColorRefs.get(`${dep.parentName}/${dep.parentVariant}`);

      dep.parentColors = refs
        ? [...refs].map((c) => ({
            colorKey: `${c}Color`,
            defaultCount: loadedStyle.value!.colors().get(c)?.values().length ?? 0,
          }))
        : [];
    }

    // Scan canvas elements — colors referenced there are always visible
    // (no component visibility needed), so they stay mapped to []
    collectCanvasColorRefs(
      loadedStyle.value.canvas().elements() as unknown as readonly DefinitionElement[],
      colorRefs,
    );

    const colorMap: Record<string, ColorComponentRef[]> = {};

    for (const [name, refs] of colorRefs) {
      colorMap[name] = refs;
    }

    return { deps, colorMap };
  });

  const componentDeps = computed(() => analyzed.value.deps);
  const colorComponentMap = computed(() => analyzed.value.colorMap);

  return { componentDeps, colorComponentMap };
}

function isColorAttr(val: unknown): val is { type: 'color'; value: string } {
  if (!val || typeof val !== 'object') return false;

  const attr = val as Record<string, unknown>;

  return attr.type === 'color' && typeof attr.value === 'string';
}

function collectComponentRefs(
  elements: readonly DefinitionElement[],
  parentName: string,
  parentVariant: string,
  deps: Record<string, ComponentDependency>,
  colorRefs: Set<string>,
) {
  for (const el of elements) {
    if (el.type() === 'component' && typeof el.value() === 'string') {
      deps[el.value() as string] = { parentName, parentVariant, parentColors: [] };
    }

    const attrs = el.attributes();

    if (attrs) {
      for (const val of Object.values(attrs)) {
        if (isColorAttr(val)) {
          colorRefs.add(val.value);
        }
      }
    }

    collectComponentRefs(el.children(), parentName, parentVariant, deps, colorRefs);
  }
}

/**
 * Register canvas-level color references. Colors found here without an
 * existing entry get mapped to [] (always visible, no component needed).
 */
function collectCanvasColorRefs(
  elements: readonly DefinitionElement[],
  colorRefs: Map<string, ColorComponentRef[]>,
) {
  for (const el of elements) {
    const attrs = el.attributes();

    if (attrs) {
      for (const val of Object.values(attrs)) {
        if (isColorAttr(val) && !colorRefs.has(val.value)) {
          colorRefs.set(val.value, []);
        }
      }
    }

    collectCanvasColorRefs(el.children(), colorRefs);
  }
}
