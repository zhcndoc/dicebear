/**
 * Build preview options for general (non-component) avatar properties —
 * seed, backgroundType, backgroundRotation, and generic values.
 * Component-specific options (Variant, Color, Probability) are rendered
 * through ComponentPreview.
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
