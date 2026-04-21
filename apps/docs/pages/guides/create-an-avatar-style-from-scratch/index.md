---
title: Create an Avatar Style from Scratch | DiceBear
description: >
  Learn how to create a DiceBear avatar style from scratch by writing a JSON
  definition file. No Figma or design tools required.
---

# Create an avatar style from scratch

We highly recommend our
[Figma plugin](/guides/create-an-avatar-style-with-figma/) to create an avatar
style. Most of DiceBear's official avatar styles were created with the plugin.
But you can also create an avatar style by writing a JSON
[definition file](/specification/definition-schema/) by hand.

## Minimal example

A minimal style definition with a colored circle:

```json
{
  "canvas": {
    "width": 100,
    "height": 100,
    "elements": [
      {
        "type": "element",
        "name": "circle",
        "attributes": {
          "cx": "50",
          "cy": "50",
          "r": "45",
          "fill": { "type": "color", "name": "background" }
        }
      }
    ]
  },
  "colors": {
    "background": {
      "values": ["#f94144", "#f9c74f", "#90be6d", "#43aa8b", "#577590"]
    }
  }
}
```

Save this as `my-style.json` and test it:

```
dicebear ./my-style.json ./output --count 5
```

The PRNG picks a different background color for each seed.

## Adding components

Components are the randomizable parts of your avatar. Each component has
multiple variants that the PRNG can choose from.

Let's add a face component with two variants:

```json
{
  "canvas": {
    "width": 100,
    "height": 100,
    "elements": [
      {
        "type": "element",
        "name": "circle",
        "attributes": {
          "cx": "50",
          "cy": "50",
          "r": "45",
          "fill": { "type": "color", "name": "background" }
        }
      },
      {
        "type": "component",
        "name": "face"
      }
    ]
  },
  "components": {
    "face": {
      "width": 100,
      "height": 100,
      "variants": {
        "smile": {
          "elements": [
            {
              "type": "element",
              "name": "circle",
              "attributes": { "cx": "35", "cy": "40", "r": "4", "fill": "#000" }
            },
            {
              "type": "element",
              "name": "circle",
              "attributes": { "cx": "65", "cy": "40", "r": "4", "fill": "#000" }
            },
            {
              "type": "element",
              "name": "path",
              "attributes": {
                "d": "M 30 60 Q 50 80 70 60",
                "stroke": "#000",
                "stroke-width": "3",
                "fill": "none"
              }
            }
          ]
        },
        "neutral": {
          "elements": [
            {
              "type": "element",
              "name": "circle",
              "attributes": { "cx": "35", "cy": "40", "r": "4", "fill": "#000" }
            },
            {
              "type": "element",
              "name": "circle",
              "attributes": { "cx": "65", "cy": "40", "r": "4", "fill": "#000" }
            },
            {
              "type": "element",
              "name": "line",
              "attributes": {
                "x1": "35",
                "y1": "62",
                "x2": "65",
                "y2": "62",
                "stroke": "#000",
                "stroke-width": "3"
              }
            }
          ]
        }
      }
    }
  },
  "colors": {
    "background": {
      "values": ["#f94144", "#f9c74f", "#90be6d", "#43aa8b", "#577590"]
    }
  }
}
```

The `canvas.elements` array references the `face` component via
`{ "type": "component", "name": "face" }`. The PRNG selects either the
`smile` or `neutral` variant.

## Multiple components

You can add as many components as you like. Each component is independent — the
PRNG selects a variant for each one separately.

```json
{
  "components": {
    "eyes": {
      "width": 100,
      "height": 100,
      "variants": {
        "round": { "elements": [...] },
        "narrow": { "elements": [...] }
      }
    },
    "mouth": {
      "width": 100,
      "height": 100,
      "variants": {
        "smile": { "elements": [...] },
        "open": { "elements": [...] },
        "flat": { "elements": [...] }
      }
    },
    "accessories": {
      "width": 100,
      "height": 100,
      "probability": 30,
      "variants": {
        "glasses": { "elements": [...] },
        "hat": { "elements": [...] }
      }
    }
  }
}
```

### Probability

The `probability` property (0-100) controls how often a component appears.
In the example above, `accessories` only appears in ~30% of generated avatars.
Default is `100` (always visible).

### Variant weights

Control how often specific variants are selected:

```json
{
  "variants": {
    "common": { "weight": 3, "elements": [...] },
    "uncommon": { "weight": 1, "elements": [...] },
    "rare": { "weight": 0, "elements": [...] }
  }
}
```

Higher weight = more likely to be selected. Weight `0` is only chosen when all
other weights are also `0`. Default weight is `1`.

### Component transforms

Components can have default rotation, translation, and scale ranges:

```json
{
  "eyes": {
    "width": 80,
    "height": 40,
    "rotate": [-5, 5],
    "scale": [0.95, 1.05],
    "translate": {
      "x": [-2, 2],
      "y": [-3, 3]
    },
    "variants": { ... }
  }
}
```

## Color palettes

Colors can be referenced from element attributes. The PRNG picks a value from
the palette for each avatar.

```json
{
  "colors": {
    "skin": {
      "values": ["#f5d6c3", "#d4a889", "#a67c5b", "#614335"]
    },
    "hair": {
      "values": ["#2c1b18", "#b58143", "#d6b370", "#724133"],
      "notEqualTo": ["skin"]
    },
    "text": {
      "values": ["#ffffff", "#000000"],
      "contrastTo": "background"
    }
  }
}
```

### Color references

Use color references in SVG attributes to apply dynamic colors:

```json
{
  "type": "element",
  "name": "circle",
  "attributes": {
    "fill": { "type": "color", "name": "skin" }
  }
}
```

### Color constraints

**`notEqualTo`** prevents two color groups from selecting the same color. In the
example above, `hair` will never be the same color as `skin`.

**`contrastTo`** picks the color with the highest contrast ratio against the
referenced color group. This is useful for ensuring text is readable against a
background.

## Metadata

Add metadata to your definition for license attribution:

```json
{
  "meta": {
    "license": {
      "name": "CC BY 4.0",
      "url": "https://creativecommons.org/licenses/by/4.0/",
      "text": "Full license text..."
    },
    "creator": {
      "name": "Your Name",
      "url": "https://your-website.com"
    },
    "source": {
      "name": "My Style",
      "url": "https://github.com/your/repo"
    }
  }
}
```

This metadata appears in:
- The license comment inside generated SVGs
- The CLI license banner
- The documentation (if your style is added to the official collection)

## Schema validation

Add the `$schema` property to enable validation in your editor:

```json
{
  "$schema": "https://cdn.hopjs.net/npm/@dicebear/schema@0.9.0/dist/definition.min.json",
  "canvas": { ... }
}
```

Most editors (VS Code, WebStorm, etc.) will provide autocompletion and inline
validation for your definition file.

## Testing

### With the CLI

```
dicebear ./my-style.json ./output --count 10
dicebear ./my-style.json ./output --seed "Alice" --format png
```

### With the JS Library

```js
import { Avatar } from '@dicebear/core';
import definition from './my-style.json' with { type: 'json' };

const avatar = new Avatar(definition, { seed: 'test' });
console.log(avatar.toString());
```

### With the PHP Library

```php
use DiceBear\Avatar;

$definition = json_decode(file_get_contents('./my-style.json'), true);
$avatar = new Avatar($definition, ['seed' => 'test']);
echo (string) $avatar;
```

## Next steps

- See the [Definition Schema Reference](/specification/definition-schema/) for
  the complete specification
- Browse the
  [official definitions](https://github.com/dicebear/definitions) for
  real-world examples
- Use the [Figma plugin](/guides/create-an-avatar-style-with-figma/) for a
  visual workflow
