import { computed, type Ref } from 'vue';
import type { Style } from '@dicebear/core';

export type ComponentDependency = {
  parentName: string;
  parentVariant: string;
  parentColors: { colorKey: string; defaultCount: number }[];
};

export function useDependencyMap(loadedStyle: Ref<Style | null>) {
  const componentDeps = computed<Record<string, ComponentDependency>>(() => {
    if (!loadedStyle.value) {
      return {};
    }

    const deps: Record<string, ComponentDependency> = {};
    const variantColorRefs = new Map<string, Set<string>>();

    for (const [compName, component] of loadedStyle.value.components()) {
      for (const [variantName, variant] of component.variants()) {
        const colorRefs = new Set<string>();

        collectComponentRefs(variant.elements(), compName, variantName, deps, colorRefs);

        if (colorRefs.size > 0) {
          variantColorRefs.set(`${compName}/${variantName}`, colorRefs);
        }
      }
    }

    for (const dep of Object.values(deps)) {
      const colorRefs = variantColorRefs.get(`${dep.parentName}/${dep.parentVariant}`);

      dep.parentColors = colorRefs
        ? [...colorRefs].map((c) => ({
            colorKey: `${c}Color`,
            defaultCount: loadedStyle.value!.colors().get(c)?.values().length ?? 0,
          }))
        : [];
    }

    return deps;
  });

  return { componentDeps };
}

function collectComponentRefs(
  elements: readonly { type(): string; value(): unknown; attributes(): Record<string, any> | undefined; children(): readonly any[] }[],
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
        if (val && typeof val === 'object' && val.type === 'color') {
          colorRefs.add(val.value);
        }
      }
    }

    collectComponentRefs(el.children(), parentName, parentVariant, deps, colorRefs);
  }
}
