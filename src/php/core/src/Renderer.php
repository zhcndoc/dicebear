<?php

declare(strict_types=1);

namespace DiceBear;

use DiceBear\Prng\Fnv1a;
use DiceBear\Style\Canvas;
use DiceBear\Style\Element;
use DiceBear\Utils\Initials;
use DiceBear\Utils\License;
use DiceBear\Utils\Xml;

class Renderer
{
    private Style $style;
    private Options $options;
    /** @var array<string, string> */
    private array $defs = [];
    private ?string $cachedSeedHash = null;
    private ?string $cachedInitials = null;

    public function __construct(Style $style, Options $options)
    {
        $this->style = $style;
        $this->options = $options;
    }

    public function render(): string
    {
        $canvas = $this->style->canvas();
        $background = $this->renderBackground($canvas);
        $body = $this->renderElements($canvas->elements());

        // Order matters: scale and flip around center, then rotate, translate,
        // and finally clip with border radius (outermost wrapper).
        $body = $this->applyScale($body, $canvas);
        $body = $this->applyFlip($body, $canvas);
        $body = $this->applyRotate($body, $canvas);
        $body = $this->applyTranslate($body, $canvas);
        $body = $this->applyBorderRadius($background . $body, $canvas);

        $metadata = License::xml($this->style->meta());
        $defs = count($this->defs) > 0
            ? '<defs>' . implode('', array_values($this->defs)) . '</defs>'
            : '';
        $size = $this->options->size();

        $title = $this->options->title();
        $escapedTitle = $title !== null ? Xml::escape($title) : null;

        $attrs = [
            'xmlns="http://www.w3.org/2000/svg"',
            "viewBox=\"0 0 {$canvas->width()} {$canvas->height()}\"",
        ];

        $rootAttributes = $this->renderAttributes($this->style->attributes());

        if ($rootAttributes !== '') {
            $attrs[] = ltrim($rootAttributes);
        }

        if ($escapedTitle !== null) {
            $attrs[] = 'role="img"';
            $attrs[] = "aria-label=\"{$escapedTitle}\"";
        } else {
            $attrs[] = 'aria-hidden="true"';
        }

        if ($size !== null) {
            $attrs[] = "width=\"{$size}\"";
            $attrs[] = "height=\"{$size}\"";
        }

        $titleElement = $escapedTitle !== null ? "<title>{$escapedTitle}</title>" : '';

        $svg = '<svg ' . implode(' ', $attrs) . '>' . $metadata . $defs . $titleElement . $body . '</svg>';

        if ($this->options->idRandomization()) {
            $svg = $this->randomizeIds($svg);
        }

        return $svg;
    }

    private function applyFlip(string $body, Canvas $canvas): string
    {
        $flip = $this->options->flip();

        if ($flip === 'none') {
            return $body;
        }

        $w = $canvas->width();
        $h = $canvas->height();

        // @phpstan-ignore match.unhandled
        $transform = match ($flip) {
            'horizontal' => "translate({$w}, 0) scale(-1, 1)",
            'vertical' => "translate(0, {$h}) scale(1, -1)",
            'both' => "translate({$w}, {$h}) scale(-1, -1)",
        };

        return "<g transform=\"{$transform}\">{$body}</g>";
    }

    private function applyScale(string $body, Canvas $canvas): string
    {
        $scale = $this->options->scale();

        if ($scale === 1.0) {
            return $body;
        }

        $cx = $canvas->width() / 2;
        $cy = $canvas->height() / 2;

        return "<g transform=\"translate({$cx}, {$cy}) scale({$scale}) translate(" . -$cx . ', ' . -$cy . ")\">{$body}</g>";
    }

    private function applyBorderRadius(string $body, Canvas $canvas): string
    {
        $radius = $this->options->borderRadius();

        if ($radius === 0.0) {
            return $body;
        }

        $rx = ($radius / 100) * $canvas->width();
        $ry = ($radius / 100) * $canvas->height();

        $id = 'clip-' . $this->hashSeed();

        $this->defs[$id] = "<clipPath id=\"{$id}\"><rect width=\"{$canvas->width()}\" height=\"{$canvas->height()}\" rx=\"{$rx}\" ry=\"{$ry}\"/></clipPath>";

        return "<g clip-path=\"url(#{$id})\">{$body}</g>";
    }

    private function applyRotate(string $body, Canvas $canvas): string
    {
        $rotate = $this->options->rotate();

        if ($rotate === 0.0) {
            return $body;
        }

        $cx = $canvas->width() / 2;
        $cy = $canvas->height() / 2;

        return "<g transform=\"rotate({$rotate}, {$cx}, {$cy})\">{$body}</g>";
    }

    private function applyTranslate(string $body, Canvas $canvas): string
    {
        $translateX = $this->options->translateX();
        $translateY = $this->options->translateY();

        if ($translateX === 0.0 && $translateY === 0.0) {
            return $body;
        }

        $x = ($translateX / 100) * $canvas->width();
        $y = ($translateY / 100) * $canvas->height();

        return "<g transform=\"translate({$x}, {$y})\">{$body}</g>";
    }

    private function renderBackground(Canvas $canvas): string
    {
        $colors = $this->options->color('background');

        if (count($colors) === 0) {
            return '';
        }

        $fill = Xml::escape($this->resolveColorReference('background'));

        return "<rect width=\"{$canvas->width()}\" height=\"{$canvas->height()}\" fill=\"{$fill}\"/>";
    }

    private function randomizeIds(string $svg): string
    {
        // Uses random_int() intentionally — a PRNG-based suffix would
        // produce the same ID for the same seed, preventing two identical
        // avatars from coexisting in the same document.
        $suffix = str_pad(dechex(random_int(0, 0xffffff)), 6, '0', STR_PAD_LEFT);
        $ids = [];

        if (preg_match_all('/\bid="([^"]+)"/', $svg, $matches)) {
            $ids = array_unique($matches[1]);
        }

        if (count($ids) === 0) {
            return $svg;
        }

        $escaped = array_map(fn($id) => preg_quote($id, '/'), $ids);
        $pattern = '/(id="|url\(#|href="#)(' . implode('|', $escaped) . ')("|\))/';

        return preg_replace_callback($pattern, function ($match) use ($suffix) {
            return $match[1] . $match[2] . '-' . $suffix . $match[3];
        }, $svg);
    }

    /** @param list<Element> $elements */
    private function renderElements(array $elements): string
    {
        return implode('', array_map(fn($el) => $this->renderElement($el), $elements));
    }

    private function renderElement(Element $element): string
    {
        // @phpstan-ignore match.unhandled
        return match ($element->type()) {
            'element' => $this->renderSvgElement($element),
            'text' => $this->renderTextElement($element),
            'component' => $this->renderComponentElement($element),
        };
    }

    // Element names and attribute names are not escaped here — they are
    // validated by StyleValidator against a strict allowlist schema
    // (no <script>, no event handlers). Values are escaped via Xml::escape().
    private function renderSvgElement(Element $element): string
    {
        $name = $element->name();

        if ($name === null) {
            return '';
        }

        if ($name === 'defs') {
            foreach ($element->children() as $child) {
                $rendered = $this->renderElement($child);

                if (strlen($rendered) > 0) {
                    $attrs = $child->attributes();
                    $id = isset($attrs['id']) && is_string($attrs['id']) ? $attrs['id'] : '_' . count($this->defs);
                    $this->defs[$id] = $rendered;
                }
            }

            return '';
        }

        $attrs = $this->renderAttributes($element->attributes());
        $children = $this->renderElements($element->children());

        if (strlen($children) === 0) {
            return "<{$name}{$attrs}/>";
        }

        return "<{$name}{$attrs}>{$children}</{$name}>";
    }

    private function renderTextElement(Element $element): string
    {
        $value = $element->value();

        return $value !== null ? Xml::escape($this->resolveValue($value)) : '';
    }

    private function renderComponentElement(Element $element): string
    {
        $value = $element->value();

        if (!is_string($value)) {
            return '';
        }

        $variantName = $this->options->variant($value);

        if ($variantName === null) {
            return '';
        }

        $components = $this->style->components();
        $component = $components[$value] ?? null;

        if ($component === null) {
            return '';
        }

        $variants = $component->variants();
        $variant = $variants[$variantName] ?? null;

        if ($variant === null) {
            return '';
        }

        $body = $this->renderElements($variant->elements());
        $transforms = $this->buildTransforms($value);

        if (count($transforms) === 0) {
            return $body;
        }

        $transform = implode(' ', $transforms);

        return "<g transform=\"{$transform}\">{$body}</g>";
    }

    /** @return list<string> */
    private function buildTransforms(string $componentName): array
    {
        $transforms = [];
        $translateX = $this->options->translateX($componentName);
        $translateY = $this->options->translateY($componentName);
        $rotate = $this->options->rotate($componentName);

        if ($translateX !== 0.0 || $translateY !== 0.0) {
            $transforms[] = "translate({$translateX}, {$translateY})";
        }

        if ($rotate !== 0.0) {
            $components = $this->style->components();
            $component = $components[$componentName] ?? null;

            if ($component === null) {
                return $transforms;
            }

            $cx = $component->width() / 2;
            $cy = $component->height() / 2;
            $transforms[] = "rotate({$rotate}, {$cx}, {$cy})";
        }

        return $transforms;
    }

    /** @param array<string, mixed>|null $attributes */
    private function renderAttributes(?array $attributes): string
    {
        if ($attributes === null) {
            return '';
        }

        $parts = [];

        foreach ($attributes as $key => $value) {
            if ($value === null) {
                continue;
            }

            $parts[] = "{$key}=\"" . Xml::escape($this->resolveAttributeValue($value)) . '"';
        }

        if (count($parts) === 0) {
            return '';
        }

        return ' ' . implode(' ', $parts);
    }

    /** @param string|array<string, mixed> $value */
    private function resolveAttributeValue(string|array $value): string
    {
        if (is_string($value)) {
            return $value;
        }

        if (($value['type'] ?? null) === 'color') {
            return $this->resolveColorReference($value['value']);
        }

        return $this->resolveVariable($value['value']);
    }

    private function resolveColorReference(string $name): string
    {
        $colors = $this->options->color($name);
        $fill = $this->options->colorFill($name);

        if ($fill === 'solid' || count($colors) <= 1) {
            return $colors[0] ?? 'none';
        }

        return $this->buildGradientDef($name, $colors);
    }

    /** @param list<string> $colors */
    private function buildGradientDef(string $name, array $colors): string
    {
        $fill = $this->options->colorFill($name);
        $rotation = $this->options->colorAngle($name);
        $id = "{$name}-color-{$this->hashSeed()}";
        $tag = $fill === 'linear' ? 'linearGradient' : 'radialGradient';
        $rotateAttr = $rotation !== 0.0
            ? " gradientTransform=\"rotate({$rotation}, 0.5, 0.5)\""
            : '';

        $stops = [];
        $count = count($colors);

        foreach ($colors as $i => $color) {
            $offset = (int) round($i / ($count - 1) * 100);
            $stops[] = "<stop offset=\"{$offset}%\" stop-color=\"" . Xml::escape($color) . '"/>';
        }

        $this->defs[$id] = "<{$tag} id=\"{$id}\"{$rotateAttr}>" . implode('', $stops) . "</{$tag}>";

        return "url(#{$id})";
    }

    /** @param string|array<string, mixed> $value */
    private function resolveValue(string|array $value): string
    {
        if (is_string($value)) {
            return $value;
        }

        if (($value['type'] ?? null) === 'variable') {
            return $this->resolveVariable($value['value']);
        }

        return '';
    }

    private function resolveVariable(string $name): string
    {
        // @phpstan-ignore match.unhandled
        return match ($name) {
            'initial' => mb_substr($this->initials(), 0, 1),
            'initials' => $this->initials(),
            'fontWeight' => (string) $this->options->fontWeight(),
            'fontFamily' => $this->options->fontFamily(),
        };
    }

    private function initials(): string
    {
        return $this->cachedInitials ??= Initials::fromSeed($this->options->seed());
    }

    private function hashSeed(): string
    {
        return $this->cachedSeedHash ??= Fnv1a::hex($this->options->seed());
    }
}
