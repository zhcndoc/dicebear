---
title: JavaScript Avatar Library – Browser & Node.js
description: >
  Use the DiceBear JavaScript avatar library to generate SVG profile pictures in
  the browser (vanilla JS), React, Vue, Angular, Svelte, and Node.js. TypeScript support included.
---

# JavaScript Avatar Library

The library is written in [TypeScript](https://www.typescriptlang.org/) /
[JavaScript](https://developer.mozilla.org/en-US/Web/JavaScript) and can be used
in the browser and also in [Node.js](https://nodejs.org/en/) (version 22 or
higher). In other environments you may be interested in the
[PHP Library](/how-to-use/php-library/), the
[HTTP API](/how-to-use/http-api/) or the [CLI](/how-to-use/cli/).

The library is a pure
[ESM package](https://developer.mozilla.org/en-US/Web/JavaScript/Guide/Modules).
[Sindre Sorhus](https://github.com/sindresorhus) has written a great
[help page](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
if you are new to ESM packages.

## Installation

You need two packages: the core library `@dicebear/core` and the avatar style
definitions `@dicebear/definitions`.

```
npm install @dicebear/core @dicebear/definitions
```

## Usage

We use the avatar style [lorelei](/styles/lorelei/) in our example. You can find
more avatar styles [here](/styles/).

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John Doe',
  // ... other options
});

const svg = avatar.toString();
```

Each avatar style comes with several options. You can find them on the details
page of each [avatar style](/styles/).

::: tip

If you'd like to integrate the library into a framework, check out our guides
for [Angular](/guides/use-the-library-with-angular/),
[React](/guides/use-the-library-with-react/),
[React Native](/guides/use-the-library-with-react-native/),
[Vue](/guides/use-the-library-with-vue/) or
[Svelte](/guides/use-the-library-with-svelte/).

:::

:::info

We provide a large number of avatar styles from different artists. The avatar
styles are licensed under different licenses that the artists can choose
themselves. For a quick overview we have created an
[license overview](/licenses/) for you.

:::

## Deterministic avatars

The `seed` option is the key to generating deterministic avatars. The same seed
will always produce the same avatar, making it perfect for user profiles:

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

// These will always produce the same avatar
const avatar1 = new Avatar(lorelei, { seed: 'user-123' });
const avatar2 = new Avatar(lorelei, { seed: 'user-123' });

avatar1.toString() === avatar2.toString(); // true
```

## Classes

### `Avatar`

The main class for generating avatars. Accepts a style definition (or a `Style`
instance) and optional options.

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, { // [!code focus:3]
  // ... options
});
```

### `Style`

An immutable wrapper around a style definition. Use it when you want to reuse
the same parsed style across multiple avatars without re-parsing each time.

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const style = new Style(lorelei); // [!code focus:4]

const avatar1 = new Avatar(style, { seed: 'Alice' });
const avatar2 = new Avatar(style, { seed: 'Bob' });
```

### `OptionsDescriptor`

Describes all valid options for a given style. Useful for building UIs or
validating user input. See
[Access Style Options](/guides/access-all-available-options/) for details.

## Methods

### `.toString()`

**Return type:** `string`

Returns the avatar as SVG in XML format.

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  // ... options
});

const svg = avatar.toString(); // [!code focus]
```

### `.toJSON()`

**Return type:** `{ svg: string, options: StyleOptions }`

Returns an object with the SVG and the resolved options that were used to
generate the avatar.

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John Doe',
  // ... other options
});

const json = avatar.toJSON(); // [!code focus]

// Example output:
// {
//   svg: '<svg>...</svg>',
//   options: {
//     seed: 'John Doe',
//     // ... resolved options
//   }
// }
```

### `.toDataUri()`

**Return type:** `string`

Returns the avatar as [data uri](https://en.wikipedia.org/wiki/Data_URI_scheme).
This is useful for embedding the avatar directly in HTML or CSS.

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John Doe',
  // ... other options
});

const dataUri = avatar.toDataUri(); // [!code focus]

// Use in HTML
// <img src={dataUri} alt="Avatar" />
```

## Core options

These options are available for all avatar styles:

| Option              | Type                                              | Default     | Description                                      |
| ------------------- | ------------------------------------------------- | ----------- | ------------------------------------------------ |
| `seed`              | `string`                                          | `''`        | Seed for deterministic generation                |
| `flip`              | `'none' \| 'horizontal' \| 'vertical' \| 'both'` | `'none'`    | Flip the avatar                                  |
| `rotate`            | `number \| [min, max]`                            | `0`         | Rotate the avatar (-360 to 360 degrees)          |
| `scale`             | `number \| [min, max]`                            | `1`         | Scale the avatar                                 |
| `borderRadius`      | `number \| [min, max]`                            | `0`         | Border radius (0-50 percent, 50 = circle)        |
| `size`              | `number`                                          | _undefined_ | Fixed size in pixels                             |
| `translateX`        | `number \| [min, max]`                            | `0`         | Horizontal translation (-100 to 100 percent)     |
| `translateY`        | `number \| [min, max]`                            | `0`         | Vertical translation (-100 to 100 percent)       |
| `idRandomization`   | `boolean`                                         | `false`     | Randomize SVG element IDs                        |
| `title`             | `string`                                          | _undefined_ | Accessible title for the SVG                     |
| `fontFamily`        | `string \| string[]`                              | `'system-ui'` | Font family for text-based styles              |
| `fontWeight`        | `number \| number[]`                              | `400`       | Font weight for text-based styles (1-1000)       |

### Background options

| Option                    | Type                                    | Default     | Description                                |
| ------------------------- | --------------------------------------- | ----------- | ------------------------------------------ |
| `backgroundColor`         | `string \| string[]`                    | _undefined_ | Background colors (hex with #)             |
| `backgroundColorFill`     | `'solid' \| 'linear' \| 'radial'`      | `'solid'`   | Background fill type                       |
| `backgroundColorFillStops`| `number \| [min, max]`                  | _undefined_ | Number of gradient stops                   |
| `backgroundColorAngle`    | `number \| [min, max]`                  | _undefined_ | Gradient angle (-360 to 360 degrees)       |

### Dynamic component options

For each component in a style (e.g. `eyes`, `mouth`, `hair`), the following
options are available:

| Pattern                   | Type                                   | Description                              |
| ------------------------- | -------------------------------------- | ---------------------------------------- |
| `{component}Variant`      | `string \| string[] \| Record<string, number>` | Select specific variants or set weights |
| `{component}Probability`  | `number`                               | Visibility probability (0-100)           |
| `{component}Rotate`       | `number \| [min, max]`                 | Component rotation (-360 to 360)         |
| `{component}TranslateX`   | `number \| [min, max]`                 | Component horizontal offset (-100 to 100)|
| `{component}TranslateY`   | `number \| [min, max]`                 | Component vertical offset (-100 to 100)  |

### Dynamic color options

For each color group in a style (e.g. `skin`, `hair`) and `background`, the
following options are available:

| Pattern                   | Type                                    | Description                              |
| ------------------------- | --------------------------------------- | ---------------------------------------- |
| `{color}Color`            | `string \| string[]`                    | Override color palette (hex with #)      |
| `{color}ColorFill`        | `'solid' \| 'linear' \| 'radial'`      | Color fill type                          |
| `{color}ColorFillStops`   | `number \| [min, max]`                  | Number of gradient stops                 |
| `{color}ColorAngle`       | `number \| [min, max]`                  | Gradient angle (-360 to 360 degrees)     |

## Examples

### Avatar with custom background

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John Doe',
  backgroundColor: ['#b6e3f4', '#c0aede', '#d1d4f9'],
  // ... other options
});
```

### Fixed size avatar

```js
import { Avatar } from '@dicebear/core';
import bottts from '@dicebear/definitions/bottts.json' with { type: 'json' };

const avatar = new Avatar(bottts, {
  seed: 'robot-42',
  size: 128,
  borderRadius: 50, // circular avatar
  // ... other options
});
```

### Avatar with transformations

```js
import { Avatar } from '@dicebear/core';
import avataaars from '@dicebear/definitions/avataaars.json' with { type: 'json' };

const avatar = new Avatar(avataaars, {
  seed: 'Jane Doe',
  flip: 'horizontal',
  rotate: 10,
  scale: 90,
  translateY: 5,
  // ... other options
});
```

### Multiple avatars on the same page

When rendering multiple avatars on the same page, use `idRandomization` to
prevent SVG ID conflicts:

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const users = ['alice', 'bob', 'charlie'];

const avatars = users.map((user) =>
  new Avatar(lorelei, {
    seed: user,
    idRandomization: true,
    // ... other options
  }).toString(),
);
```

### Weighted variant selection

You can influence the PRNG to prefer certain variants by passing a weight map:

```js
import { Avatar } from '@dicebear/core';
import avataaars from '@dicebear/definitions/avataaars.json' with { type: 'json' };

const avatar = new Avatar(avataaars, {
  seed: 'John Doe',
  topVariant: { short01: 2, short02: 2, long01: 1 },
  // ... other options
});
```

## TypeScript

The library is fully typed. You can import types for better IDE support:

```ts
import { Avatar, Style } from '@dicebear/core';
import type { StyleOptions, StyleDefinition } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John Doe',
  backgroundColor: ['#b6e3f4'],
  // ... other options
});
```

When importing a style definition as JSON, TypeScript infers the literal types
of the definition, providing autocomplete for component and color option names.

## Convert to other formats

Need PNG, JPEG, or other formats? Check out the
[Converter](/how-to-use/js-library/converter/) package.
