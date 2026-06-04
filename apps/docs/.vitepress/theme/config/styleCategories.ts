const minimalistStyles = new Set([
  'disco',
  'glass',
  'glyphs',
  'identicon',
  'rings',
  'shape-grid',
  'shapes',
  'stripes',
  'triangles',
  'initial-face',
  'initials',
  'icons',
  'thumbs',
]);

export const CUSTOM_CATEGORY = 'Custom';

export const categoryOrder = [
  CUSTOM_CATEGORY,
  'Minimalist',
  'Characters',
  'Other',
];

export const previewSeeds = ['Felix', 'Aneka', 'Milo', 'Luna'];

export function getStyleCategory(name: string): string {
  return minimalistStyles.has(name) ? 'Minimalist' : 'Characters';
}

export function normalizeLicense(license: string): string {
  if (license.includes('CC BY 4.0')) {
    return 'CC BY 4.0';
  }

  if (license.includes('CC0 1.0')) {
    return 'CC0 1.0';
  }

  if (license.includes('MIT')) {
    return 'MIT';
  }

  return 'Other';
}
