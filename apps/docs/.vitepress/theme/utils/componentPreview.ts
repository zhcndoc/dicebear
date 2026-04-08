import { Style, Avatar, type StyleDefinition } from '@dicebear/core';
import { isColorAttr, type DefinitionElement } from './definitionElement';

export type ColorUsageRef = {
  component: string;
  variant: string;
};

function collectColorRefs(
  elements: readonly DefinitionElement[],
  result: Set<string>,
): void {
  for (const el of elements) {
    const attrs = el.attributes();

    if (attrs) {
      for (const val of Object.values(attrs)) {
        if (isColorAttr(val)) {
          result.add(val.value);
        }
      }
    }

    collectColorRefs(el.children(), result);
  }
}

function collectChildComponents(
  elements: readonly DefinitionElement[],
  result: Set<string>,
): void {
  for (const el of elements) {
    if (el.type() === 'component' && typeof el.value() === 'string') {
      result.add(el.value() as string);
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
  #colorUsageCache?: Record<string, ColorUsageRef[]>;
  #syntheticStyleCache = new Map<string, Style>();

  constructor(style: Style) {
    this.#style = style;
    this.#definition = style.definition();
  }

  colorUsage(): Record<string, ColorUsageRef[]> {
    if (this.#colorUsageCache) return this.#colorUsageCache;

    const result: Record<string, ColorUsageRef[]> = {};
    const seen = new Set<string>();

    for (const name of this.#style.colors().keys()) {
      result[name] = [];
    }

    for (const [compName, component] of this.#style.components()) {
      for (const [variantName, variant] of component.variants()) {
        const colors = new Set<string>();

        collectColorRefs(asElements(variant.elements()), colors);

        for (const colorName of colors) {
          const key = `${colorName}:${compName}`;

          if (!seen.has(key)) {
            seen.add(key);
            (result[colorName] ??= []).push({ component: compName, variant: variantName });
          }
        }
      }
    }

    this.#colorUsageCache = result;

    return result;
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
          elements: [{ type: 'component' as const, value: componentName }],
        },
        attributes: def.attributes,
        components: def.components,
        colors: def.colors,
      });
      this.#syntheticStyleCache.set(componentName, syntheticStyle);
    }

    const previewOptions: Record<string, unknown> = {
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
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(this.toSvg(componentName, variantName, options))}`;
  }

  toDataUriForColor(
    colorName: string,
    options?: Record<string, unknown>,
  ): string {
    const svg = this.toSvgForColor(colorName, options);

    if (!svg) return '';

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  toSvgForColor(
    colorName: string,
    options?: Record<string, unknown>,
  ): string {
    const usage = this.colorUsage();
    const refs = usage[colorName];

    if (!refs?.length) return '';

    const { component, variant } = refs[0];

    return this.toSvg(component, variant, options);
  }

  #findChildComponents(componentName: string, variantName: string): Set<string> {
    const result = new Set<string>();
    const component = this.#style.components().get(componentName);
    const variant = component?.variants().get(variantName);

    if (!variant) return result;

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

    return result;
  }
}
