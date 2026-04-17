import { Style, Avatar, type StyleDefinition } from '@dicebear/core';
import { type DefinitionElement } from './definitionElement';

function collectChildComponents(
  elements: readonly DefinitionElement[],
  result: Set<string>,
): void {
  for (const el of elements) {
    if (el.type() === 'component' && typeof el.name() === 'string') {
      result.add(el.name() as string);
    }

    collectChildComponents(el.children(), result);
  }
}

function asElements(elements: readonly unknown[]): readonly DefinitionElement[] {
  return elements as readonly DefinitionElement[];
}

export class ComponentPreview {
  #style: Style;
  #definition: StyleDefinition;
  #syntheticStyleCache = new Map<string, Style>();
  #childComponentsCache = new Map<string, Set<string>>();
  #dataUriCache = new Map<string, string>();

  constructor(style: Style) {
    this.#style = style;
    this.#definition = style.definition();
  }

  firstVariant(componentName: string): string | undefined {
    const component = this.#style.components().get(componentName);

    if (!component) return undefined;

    return component.variants().keys().next().value;
  }

  toSvg(
    componentName: string,
    variantName: string,
    options?: Record<string, unknown>,
  ): string {
    const def = this.#definition;
    const comp = def.components?.[componentName];

    if (!comp) return '';

    // Cache the Style per component to avoid repeated validation + cloning
    let syntheticStyle = this.#syntheticStyleCache.get(componentName);

    if (!syntheticStyle) {
      syntheticStyle = new Style({
        canvas: {
          width: comp.width,
          height: comp.height,
          elements: [{ type: 'component' as const, name: componentName }],
        },
        attributes: def.attributes,
        components: def.components,
        colors: def.colors,
      });
      this.#syntheticStyleCache.set(componentName, syntheticStyle);
    }

    // Pass a fixed seed so variables that depend on it (e.g. `initial` /
    // `initials` text content in the initials style) resolve, otherwise
    // text-driven colors render onto an empty <text> and stay invisible.
    const previewOptions: Record<string, unknown> = {
      seed: 'JD',
      backgroundColor: [],
      [`${componentName}Probability`]: 100,
    };

    const children = this.#findChildComponents(componentName, variantName);

    for (const [name] of this.#style.components()) {
      if (name === componentName || children.has(name)) continue;
      previewOptions[`${name}Probability`] = 0;
    }

    Object.assign(previewOptions, options);
    previewOptions[`${componentName}Variant`] = variantName;

    return new Avatar(syntheticStyle, previewOptions).toString();
  }

  toDataUri(
    componentName: string,
    variantName: string,
    options?: Record<string, unknown>,
  ): string {
    if (!options) {
      const key = `${componentName}|${variantName}`;
      const cached = this.#dataUriCache.get(key);

      if (cached !== undefined) return cached;

      const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(this.toSvg(componentName, variantName))}`;

      this.#dataUriCache.set(key, uri);

      return uri;
    }

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(this.toSvg(componentName, variantName, options))}`;
  }

  #findChildComponents(componentName: string, variantName: string): Set<string> {
    const key = `${componentName}|${variantName}`;
    const cached = this.#childComponentsCache.get(key);

    if (cached) return cached;

    const result = new Set<string>();
    const component = this.#style.components().get(componentName);
    const variant = component?.variants().get(variantName);

    if (variant) {
      collectChildComponents(asElements(variant.elements()), result);

      const queue = [...result];

      while (queue.length > 0) {
        const childName = queue.pop()!;
        const child = this.#style.components().get(childName);

        if (!child) continue;

        for (const [, childVariant] of child.variants()) {
          const nested = new Set<string>();

          collectChildComponents(asElements(childVariant.elements()), nested);

          for (const name of nested) {
            if (!result.has(name)) {
              result.add(name);
              queue.push(name);
            }
          }
        }
      }
    }

    this.#childComponentsCache.set(key, result);

    return result;
  }
}
