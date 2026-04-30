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
import { Fnv1a } from './Prng/Fnv1a.js';
import { Initials } from './Utils/Initials.js';
import { License } from './Utils/License.js';
import { Xml } from './Utils/Xml.js';

/**
 * Walks a style's element tree and turns it into the final SVG markup.
 *
 * The renderer is single-use: it accumulates `<defs>` entries and per-render
 * caches across method calls, so a fresh instance is required per avatar.
 */
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

  /**
   * Builds the complete SVG document for the avatar.
   */
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

    const rootAttributes = this.#renderAttributes(this.#style.attributes());

    if (rootAttributes) {
      attrs.push(rootAttributes.trimStart());
    }

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

  /**
   * Wraps `body` in a flip transform when `flip` is set to anything other
   * than `'none'`.
   */
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

  /**
   * Wraps `body` in a uniform scale transform around the canvas center when
   * the option differs from `1`.
   */
  #applyScale(body: string, canvas: Canvas): string {
    const scale = this.#options.scale();

    if (scale === 1) {
      return body;
    }

    const cx = canvas.width() / 2;
    const cy = canvas.height() / 2;

    return `<g transform="translate(${cx}, ${cy}) scale(${scale}) translate(${-cx}, ${-cy})">${body}</g>`;
  }

  /**
   * Clips `body` to a rounded rectangle and registers the corresponding
   * `clipPath` in `<defs>` when `borderRadius` is non-zero.
   */
  #applyBorderRadius(body: string, canvas: Canvas): string {
    const radius = this.#options.borderRadius();

    if (radius === 0) {
      return body;
    }

    const id = `clip-${this.#hashSeed()}`;

    const rx = (radius / 100) * canvas.width();
    const ry = (radius / 100) * canvas.height();

    this.#defs.set(
      id,
      `<clipPath id="${id}"><rect width="${canvas.width()}" height="${canvas.height()}" rx="${rx}" ry="${ry}"/></clipPath>`,
    );

    return `<g clip-path="url(#${id})">${body}</g>`;
  }

  /**
   * Wraps `body` in a rotation around the canvas center when `rotate` is
   * non-zero.
   */
  #applyRotate(body: string, canvas: Canvas): string {
    const rotate = this.#options.rotate();

    if (rotate === 0) {
      return body;
    }

    const cx = canvas.width() / 2;
    const cy = canvas.height() / 2;

    return `<g transform="rotate(${rotate}, ${cx}, ${cy})">${body}</g>`;
  }

  /**
   * Wraps `body` in a translate transform when either `translateX` or
   * `translateY` is non-zero. Offsets are interpreted as percentages of the
   * canvas dimensions.
   */
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

  /**
   * Returns a `<rect>` filling the canvas with the resolved background color,
   * or an empty string when no background colors are configured.
   */
  #renderBackground(canvas: Canvas): string {
    const colors = this.#options.color('background');

    if (colors.length === 0) {
      return '';
    }

    return `<rect width="${canvas.width()}" height="${canvas.height()}" fill="${Xml.escape(this.#resolveColorReference('background'))}"/>`;
  }

  /**
   * Suffixes every `id` declaration and reference with a random hex string
   * so that multiple instances of the same avatar do not collide in a shared
   * document. Uses `Math.random()` intentionally — a PRNG-derived suffix
   * would produce the same ID for the same seed.
   */
  #randomizeIds(svg: string): string {
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

  /**
   * Renders a list of elements and concatenates their markup.
   */
  #renderElements(elements: readonly Element[]): string {
    return elements.map((el) => this.#renderElement(el)).join('');
  }

  /**
   * Dispatches a single element to the renderer for its type.
   */
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

  /**
   * Renders an SVG element. The special `defs` name diverts children into the
   * shared `<defs>` block.
   *
   * Element names and attribute names are not escaped here — they are
   * validated by StyleValidator against a strict allowlist schema (no
   * `<script>`, no event handlers). Values are escaped via `Xml.escape()`.
   */
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

  /**
   * Renders a text element by escaping its resolved value.
   */
  #renderTextElement(element: Element): string {
    const value = element.value();

    return value !== undefined ? Xml.escape(this.#resolveValue(value)) : '';
  }

  /**
   * Resolves a component reference to a chosen variant and emits a `<use>`
   * pointing at a `<defs>` entry that holds the variant body. Aliases of the
   * same source component sharing a variant — and identical components
   * referenced more than once — therefore produce a single `<defs>` entry
   * referenced by every `<use>`, never duplicated SVG markup.
   */
  #renderComponentElement(element: Element): string {
    const componentName = element.name();

    if (typeof componentName !== 'string') {
      return '';
    }

    const variantName = this.#options.variant(componentName);

    if (!variantName) {
      return '';
    }

    const component = this.#style.components().get(componentName);
    if (!component) {
      return '';
    }

    const variant = component.variants().get(variantName);
    if (!variant) {
      return '';
    }

    const sourceName = component.extendsName() ?? componentName;
    const id = `${sourceName}-${variantName}-${this.#hashSeed()}`;

    if (!this.#defs.has(id)) {
      const body = this.#renderElements(variant.elements());

      this.#defs.set(id, `<g id="${id}">${body}</g>`);
    }

    const transforms = this.#buildTransforms(componentName);
    const transformAttr =
      transforms.length > 0 ? ` transform="${transforms.join(' ')}"` : '';

    return `<use${transformAttr} href="#${id}"/>`;
  }

  /**
   * Returns the per-component SVG `transform` fragments derived from the
   * component's translate, rotate, and scale options. Translate values are
   * percentages of the component canvas dimensions, matching the
   * semantics of the user-facing `translateX` / `translateY` options.
   *
   * The fragments are ordered so that, when joined into a single `transform`
   * attribute, the scale is the rightmost (innermost) transform — applied
   * first to a point, followed by rotate, then translate.
   */
  #buildTransforms(componentName: string): string[] {
    const transforms: string[] = [];
    const translateX = this.#options.translateX(componentName);
    const translateY = this.#options.translateY(componentName);
    const rotate = this.#options.rotate(componentName);
    const scale = this.#options.scale(componentName);

    if (translateX === 0 && translateY === 0 && rotate === 0 && scale === 1) {
      return transforms;
    }

    const component = this.#style.components().get(componentName);
    if (!component) {
      return transforms;
    }

    const cx = component.width() / 2;
    const cy = component.height() / 2;

    if (translateX !== 0 || translateY !== 0) {
      const x = Math.round((translateX / 100) * component.width() * 10000) / 10000;
      const y = Math.round((translateY / 100) * component.height() * 10000) / 10000;

      transforms.push(`translate(${x}, ${y})`);
    }

    if (rotate !== 0) {
      transforms.push(`rotate(${rotate}, ${cx}, ${cy})`);
    }

    if (scale !== 1) {
      transforms.push(`translate(${cx}, ${cy}) scale(${scale}) translate(${-cx}, ${-cy})`);
    }

    return transforms;
  }

  /**
   * Serializes an attribute map to a leading space-prefixed string suitable
   * for inlining into a tag. Returns an empty string when there are no
   * attributes to render.
   */
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

  /**
   * Resolves a single attribute value: literal strings pass through, color
   * and variable references are dereferenced through the option resolver.
   */
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
      return this.#resolveColorReference(value.name);
    }

    return this.#resolveVariable(value.name);
  }

  /**
   * Resolves a named color into either a hex string (solid fill / single
   * color) or a `url(#…)` gradient reference, registering the gradient in
   * `<defs>` as a side effect.
   */
  #resolveColorReference(name: string): string {
    const colors = this.#options.color(name);
    const fill = this.#options.colorFill(name);

    if (fill === 'solid' || colors.length <= 1) {
      return colors[0] ?? 'none';
    }

    return this.#buildGradientDef(name, colors);
  }

  /**
   * Builds the `<linearGradient>` or `<radialGradient>` for the given color
   * definition, registers it in `<defs>`, and returns its `url(#…)` reference.
   */
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

  /**
   * Resolves an element value to its final string form. Literal strings pass
   * through; variable references are dereferenced.
   */
  #resolveValue(value: StyleDefinitionElementValue): string {
    if (typeof value === 'string') {
      return value;
    }

    if (value.type === 'variable') {
      return this.#resolveVariable(value.name);
    }

    return '';
  }

  /**
   * Resolves a built-in variable reference to its current value.
   */
  #resolveVariable(name: StyleDefinitionVariableReference['name']): string {
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

  /**
   * Returns the seed-derived initials, cached after the first call.
   */
  #initials(): string {
    return (this.#cachedInitials ??= Initials.fromSeed(this.#options.seed()));
  }

  /**
   * Returns the FNV-1a hex hash of the seed, cached after the first call. The
   * value is used to derive stable but unique IDs for `<defs>` entries.
   */
  #hashSeed(): string {
    return (this.#cachedSeedHash ??= Fnv1a.hex(this.#options.seed()));
  }
}
