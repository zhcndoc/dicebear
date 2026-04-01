import type { Style } from './Style.js';
import type { Options } from './Options.js';
import type { Canvas } from './Style/Canvas.js';
import type { Element } from './Style/Element.js';
import type {
  StyleDefinitionColorReference,
  StyleDefinitionAttributes,
  StyleDefinitionVariableReference,
  StyleDefinitionElementValue,
} from './StyleDefinition.js';
import { Prng } from './Prng.js';
import { Initials } from './Utils/Initials.js';
import { License } from './Utils/License.js';
import { Xml } from './Utils/Xml.js';

export class Renderer {
  #style: Style;
  #options: Options;
  #defs = new Map<string, string>();
  #cachedSeedHash?: string;
  #cachedInitials?: string;

  constructor(style: Style, options: Options) {
    this.#style = style;
    this.#options = options;
  }

  render(): string {
    const canvas = this.#style.canvas();
    const background = this.#renderBackground(canvas);
    let body = this.#renderElements(canvas.elements());

    // Order matters: scale and flip around center, then rotate, translate,
    // and finally clip with border radius (outermost wrapper).
    body = this.#applyScale(body, canvas);
    body = this.#applyFlip(body, canvas);
    body = this.#applyRotate(body, canvas);
    body = this.#applyTranslate(body, canvas);
    body = this.#applyBorderRadius(`${background}${body}`, canvas);

    const metadata = License.xml(this.#style.meta());
    const defs =
      this.#defs.size > 0
        ? `<defs>${Array.from(this.#defs.values()).join('')}</defs>`
        : '';
    const size = this.#options.size();

    const title = this.#options.title();
    const escapedTitle = title !== undefined ? Xml.escape(title) : undefined;

    const attrs = [
      'xmlns="http://www.w3.org/2000/svg"',
      `viewBox="0 0 ${canvas.width()} ${canvas.height()}"`,
    ];

    if (escapedTitle !== undefined) {
      attrs.push('role="img"', `aria-label="${escapedTitle}"`);
    } else {
      attrs.push('aria-hidden="true"');
    }

    if (size !== undefined) {
      attrs.push(`width="${size}"`, `height="${size}"`);
    }

    const titleElement =
      escapedTitle !== undefined ? `<title>${escapedTitle}</title>` : '';

    let svg = `<svg ${attrs.join(' ')}>${metadata}${defs}${titleElement}${body}</svg>`;

    if (this.#options.idRandomization()) {
      svg = this.#randomizeIds(svg);
    }

    return svg;
  }

  #applyFlip(body: string, canvas: Canvas): string {
    const flip = this.#options.flip();

    if (flip === 'none') {
      return body;
    }

    const w = canvas.width();
    const h = canvas.height();
    let transform: string;

    switch (flip) {
      case 'horizontal':
        transform = `translate(${w}, 0) scale(-1, 1)`;
        break;
      case 'vertical':
        transform = `translate(0, ${h}) scale(1, -1)`;
        break;
      case 'both':
        transform = `translate(${w}, ${h}) scale(-1, -1)`;
        break;
    }

    return `<g transform="${transform}">${body}</g>`;
  }

  #applyScale(body: string, canvas: Canvas): string {
    const scale = this.#options.scale();

    if (scale === 1) {
      return body;
    }

    const cx = canvas.width() / 2;
    const cy = canvas.height() / 2;

    return `<g transform="translate(${cx}, ${cy}) scale(${scale}) translate(${-cx}, ${-cy})">${body}</g>`;
  }

  #applyBorderRadius(body: string, canvas: Canvas): string {
    const radius = this.#options.borderRadius();

    if (radius === 0) {
      return body;
    }

    const id = `clip-${this.#hashSeed()}`;

    this.#defs.set(
      id,
      `<clipPath id="${id}"><rect width="${canvas.width()}" height="${canvas.height()}" rx="${radius}" ry="${radius}"/></clipPath>`,
    );

    return `<g clip-path="url(#${id})">${body}</g>`;
  }

  #applyRotate(body: string, canvas: Canvas): string {
    const rotate = this.#options.rotate();

    if (rotate === 0) {
      return body;
    }

    const cx = canvas.width() / 2;
    const cy = canvas.height() / 2;

    return `<g transform="rotate(${rotate}, ${cx}, ${cy})">${body}</g>`;
  }

  #applyTranslate(body: string, canvas: Canvas): string {
    const tx = this.#options.translateX();
    const ty = this.#options.translateY();

    if (tx === 0 && ty === 0) {
      return body;
    }

    const x = (tx / 100) * canvas.width();
    const y = (ty / 100) * canvas.height();

    return `<g transform="translate(${x}, ${y})">${body}</g>`;
  }

  #renderBackground(canvas: Canvas): string {
    const colors = this.#options.color('background');

    if (colors.length === 0) {
      return '';
    }

    return `<rect width="${canvas.width()}" height="${canvas.height()}" fill="${Xml.escape(this.#resolveColorReference('background'))}"/>`;
  }

  #randomizeIds(svg: string): string {
    // Uses Math.random() intentionally — a PRNG-based suffix would
    // produce the same ID for the same seed, preventing two identical
    // avatars from coexisting in the same document.
    const suffix = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0');
    const ids = new Set<string>();

    for (const match of svg.matchAll(/\bid="([^"]+)"/g)) {
      ids.add(match[1]);
    }

    if (ids.size === 0) {
      return svg;
    }

    const escaped = Array.from(ids, (id) =>
      id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    );
    const pattern = new RegExp(
      `(id="|url\\(#|href="#)(${escaped.join('|')})("|\\))`,
      'g',
    );

    return svg.replace(
      pattern,
      (_, prefix, id, end) => `${prefix}${id}-${suffix}${end}`,
    );
  }

  #renderElements(elements: readonly Element[]): string {
    return elements.map((el) => this.#renderElement(el)).join('');
  }

  #renderElement(element: Element): string {
    switch (element.type()) {
      case 'element':
        return this.#renderSvgElement(element);
      case 'text':
        return this.#renderTextElement(element);
      case 'component':
        return this.#renderComponentElement(element);
    }
  }

  // Element names and attribute names are not escaped here — they are
  // validated by StyleValidator against a strict allowlist schema
  // (no <script>, no event handlers). Values are escaped via Xml.escape().
  #renderSvgElement(element: Element): string {
    const name = element.name();

    if (!name) {
      return '';
    }

    if (name === 'defs') {
      for (const child of element.children()) {
        const rendered = this.#renderElement(child);

        if (rendered.length > 0) {
          const id = child.attributes()?.id;
          const key = typeof id === 'string' ? id : `_${this.#defs.size}`;

          this.#defs.set(key, rendered);
        }
      }

      return '';
    }

    const attrs = this.#renderAttributes(element.attributes());
    const children = this.#renderElements(element.children());

    if (children.length === 0) {
      return `<${name}${attrs}/>`;
    }

    return `<${name}${attrs}>${children}</${name}>`;
  }

  #renderTextElement(element: Element): string {
    const value = element.value();

    return value !== undefined ? Xml.escape(this.#resolveValue(value)) : '';
  }

  #renderComponentElement(element: Element): string {
    const value = element.value();

    if (typeof value !== 'string') {
      return '';
    }

    const variantName = this.#options.variant(value);

    if (!variantName) {
      return '';
    }

    const component = this.#style.components().get(value);
    if (!component) {
      return '';
    }

    const variant = component.variants().get(variantName);
    if (!variant) {
      return '';
    }

    const body = this.#renderElements(variant.elements());
    const transforms = this.#buildTransforms(value);

    if (transforms.length === 0) {
      return body;
    }

    return `<g transform="${transforms.join(' ')}">${body}</g>`;
  }

  #buildTransforms(componentName: string): string[] {
    const transforms: string[] = [];
    const translateX = this.#options.translateX(componentName);
    const translateY = this.#options.translateY(componentName);
    const rotate = this.#options.rotate(componentName);

    if (translateX !== 0 || translateY !== 0) {
      transforms.push(`translate(${translateX}, ${translateY})`);
    }

    if (rotate !== 0) {
      const component = this.#style.components().get(componentName);
      if (!component) {
        return transforms;
      }

      const cx = component.width() / 2;
      const cy = component.height() / 2;

      transforms.push(`rotate(${rotate}, ${cx}, ${cy})`);
    }

    return transforms;
  }

  #renderAttributes(attributes: StyleDefinitionAttributes | undefined): string {
    if (!attributes) {
      return '';
    }

    const parts: string[] = [];

    for (const [key, value] of Object.entries(attributes)) {
      if (value === undefined) {
        continue;
      }

      parts.push(`${key}="${Xml.escape(this.#resolveAttributeValue(value))}"`);
    }

    if (parts.length === 0) {
      return '';
    }

    return ` ${parts.join(' ')}`;
  }

  #resolveAttributeValue(
    value:
      | string
      | StyleDefinitionColorReference
      | StyleDefinitionVariableReference,
  ): string {
    if (typeof value === 'string') {
      return value;
    }

    if (value.type === 'color') {
      return this.#resolveColorReference(value.value);
    }

    return this.#resolveVariable(value.value);
  }

  #resolveColorReference(name: string): string {
    const colors = this.#options.color(name);
    const fill = this.#options.colorFill(name);

    if (fill === 'solid' || colors.length <= 1) {
      return colors[0] ?? 'none';
    }

    return this.#buildGradientDef(name, colors);
  }

  #buildGradientDef(name: string, colors: readonly string[]): string {
    const fill = this.#options.colorFill(name);
    const rotation = this.#options.colorAngle(name);
    const id = `${name}-color-${this.#hashSeed()}`;
    const tag = fill === 'linear' ? 'linearGradient' : 'radialGradient';
    const rotateAttr =
      rotation !== 0
        ? ` gradientTransform="rotate(${rotation}, 0.5, 0.5)"`
        : '';
    const stops = colors.map((color, i) => {
      const offset = Math.round((i / (colors.length - 1)) * 100);

      return `<stop offset="${offset}%" stop-color="${Xml.escape(color)}"/>`;
    });

    this.#defs.set(
      id,
      `<${tag} id="${id}"${rotateAttr}>${stops.join('')}</${tag}>`,
    );

    return `url(#${id})`;
  }

  #resolveValue(value: StyleDefinitionElementValue): string {
    if (typeof value === 'string') {
      return value;
    }

    if (value.type === 'variable') {
      return this.#resolveVariable(value.value);
    }

    return '';
  }

  #resolveVariable(name: StyleDefinitionVariableReference['value']): string {
    switch (name) {
      case 'initial':
        return this.#initials().charAt(0);
      case 'initials':
        return this.#initials();
      case 'fontWeight':
        return String(this.#options.fontWeight());
      case 'fontFamily':
        return this.#options.fontFamily();
    }
  }

  #initials(): string {
    return (this.#cachedInitials ??= Initials.fromSeed(this.#options.seed()));
  }

  #hashSeed(): string {
    return (this.#cachedSeedHash ??= Prng.fnv1aHex(this.#options.seed()));
  }
}
