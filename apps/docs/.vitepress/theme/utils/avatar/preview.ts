import type { ComponentDependency } from '@theme/composables/useDependencyMap';

/**
 * Returns options that make the given component visible by walking
 * its parent dependency chain and disabling all unrelated components.
 */
export function getComponentVisibilityOptions(
  componentName: string,
  allComponentNames: string[],
  allDependencies: Record<string, ComponentDependency>,
): Record<string, unknown> {
  const opts: Record<string, unknown> = {
    [`${componentName}Probability`]: 100,
  };

  const keep = new Set<string>([componentName]);

  let current = componentName;

  while (allDependencies[current]) {
    const dep = allDependencies[current];

    keep.add(dep.parentName);
    opts[`${dep.parentName}Variant`] = dep.parentVariant;
    opts[`${dep.parentName}Probability`] = 100;

    for (const { colorKey, defaultCount } of dep.parentColors) {
      if (defaultCount > 1) {
        opts[colorKey] = ['555555'];
      }
    }

    current = dep.parentName;
  }

  for (const [child, dep] of Object.entries(allDependencies)) {
    if (keep.has(dep.parentName)) {
      keep.add(child);
    }
  }

  for (const name of allComponentNames) {
    if (keep.has(name)) continue;

    opts[`${name}Probability`] = 0;
  }

  return opts;
}

export function getComponentVariantPreviewOptions(
  componentName: string,
  variant: string,
  allComponentNames: string[],
  allDependencies: Record<string, ComponentDependency>,
): Record<string, unknown> {
  return {
    seed: 'JD',
    backgroundColor: [],
    [`${componentName}Variant`]: variant,
    ...getComponentVisibilityOptions(componentName, allComponentNames, allDependencies),
  };
}

/**
 * Build preview options for general (non-component) style options.
 * Component-specific options (Variant, Color, Probability, etc.) are
 * handled by ComponentPreview instead.
 */
export function getAvatarPropertyPreviewOptions(
  propertyName: string,
  propertyValue: unknown,
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

  return {
    seed: 'JD',
    [propertyName]:
      typeof propertyValue === 'string' ? [propertyValue] : propertyValue,
  };
}
