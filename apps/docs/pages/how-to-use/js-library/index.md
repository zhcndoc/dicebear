---
description: >
  Use the DiceBear avatar library for JavaScript to create avatars in your app.
  Generate profile pictures and random user avatars in browser and Node.js.
---

# JS-Library

The library is written in [TypeScript](https://www.typescriptlang.org/) /
[JavaScript](https://developer.mozilla.org/en-US/Web/JavaScript) and can be used
in the browser and also in [Node.js](https://nodejs.org/en/) (version 18 or
higher). In other environments you may be interested in the
[HTTP API](/how-to-use/http-api/) or the [CLI](/how-to-use/cli/).

The library is a pure
[ESM package](https://developer.mozilla.org/en-US/Web/JavaScript/Guide/Modules).
[Sindre Sorhus](https://github.com/sindresorhus) has written a great
[help page](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
if you are new to ESM packages.

## Installation

At least two packages are needed. The first package is the core library
`@dicebear/core` and the second package is an avatar style. In our examples we
use the package `@dicebear/collection` which contains all official avatar
styles.

```
npm install @dicebear/core @dicebear/collection
```

::: tip

We highly recommend the use of a bundler with
[tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)
functionality. If you don't have one, take a look at our guide
"[Using the library without tree shaking](/guides/use-the-library-without-tree-shaking/)".

:::

## Usage

We use the avatar style [lorelei](/styles/lorelei/) in our example. You can find
more avatar styles [here](/styles/).

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
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
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

// These will always produce the same avatar
const avatar1 = createAvatar(lorelei, { seed: 'user-123' });
const avatar2 = createAvatar(lorelei, { seed: 'user-123' });

avatar1.toString() === avatar2.toString(); // true
```

## Methods

### `createAvatar(style, options)`

**Return type:** Object with [.toString()](#tostring), [.toJson()](#tojson) and
[.toDataUri()](#todatauri) methods.

Every cool avatar starts here! An avatar style is expected as the first
argument. The second argument is an optional `object` with options. Which
options are possible here depends on the [avatar style](/styles/).

<!-- prettier-ignore -->
```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, { // [!code focus:3]
  // ... options
});
```

### `.toString()`

**Return type:** `string`

Returns the avatar as SVG in XML format.

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  // ... options
});

const svg = avatar.toString(); // [!code focus]
```

### `.toJson()`

**Return type:** `{ svg: string, extra: Record<string, unknown> }`

Returns a JSON with the SVG and additional information, such as the actual
options used. The `extra` object contains the resolved options and any
style-specific metadata.

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  seed: 'John Doe',
  // ... other options
});

const json = avatar.toJson(); // [!code focus]

// Example output:
// {
//   svg: '<svg>...</svg>',
//   extra: {
//     // resolved options and style-specific data
//   }
// }
```

### `.toDataUri()`

**Return type:** `string`

Returns the avatar as [data uri](https://en.wikipedia.org/wiki/Data_URI_scheme).
This is useful for embedding the avatar directly in HTML or CSS.

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  seed: 'John Doe',
  // ... other options
});

const dataUri = avatar.toDataUri(); // [!code focus]

// Use in HTML
// <img src={dataUri} alt="Avatar" />
```

## Core options

These options are available for all avatar styles:

| Option               | Type       | Default     | Description                                             |
| -------------------- | ---------- | ----------- | ------------------------------------------------------- |
| `seed`               | `string`   | _random_    | Seed for deterministic generation                       |
| `flip`               | `boolean`  | `false`     | Flip the avatar horizontally                            |
| `rotate`             | `number`   | `0`         | Rotate the avatar (0-360 degrees)                       |
| `scale`              | `number`   | `100`       | Scale the avatar (0-200 percent)                        |
| `radius`             | `number`   | `0`         | Border radius (0-50 percent)                            |
| `size`               | `number`   | _undefined_ | Fixed size in pixels                                    |
| `backgroundColor`    | `string[]` | _undefined_ | Background colors (hex without #, or "transparent")     |
| `backgroundType`     | `string[]` | `['solid']` | Background type: "solid" or "gradientLinear"            |
| `backgroundRotation` | `number[]` | `[0, 360]`  | Gradient rotation range (-360 to 360)                   |
| `translateX`         | `number`   | `0`         | Horizontal translation (-100 to 100 percent)            |
| `translateY`         | `number`   | `0`         | Vertical translation (-100 to 100 percent)              |
| `clip`               | `boolean`  | `true`      | Clip content to the avatar boundary                     |
| `randomizeIds`       | `boolean`  | `false`     | Randomize SVG element IDs (useful for multiple avatars) |

## Examples

### Avatar with custom background

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  seed: 'John Doe',
  backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'],
  // ... other options
});
```

### Fixed size avatar

```js
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';

const avatar = createAvatar(bottts, {
  seed: 'robot-42',
  size: 128,
  radius: 50, // circular avatar
  // ... other options
});
```

### Avatar with transformations

```js
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

const avatar = createAvatar(avataaars, {
  seed: 'Jane Doe',
  flip: true,
  rotate: 10,
  scale: 90,
  translateY: 5,
  // ... other options
});
```

### Multiple avatars on the same page

When rendering multiple avatars on the same page, use `randomizeIds` to prevent
SVG ID conflicts:

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const users = ['alice', 'bob', 'charlie'];

const avatars = users.map((user) =>
  createAvatar(lorelei, {
    seed: user,
    randomizeIds: true,
    // ... other options
  }).toString(),
);
```

## TypeScript

The library is fully typed. You can import types for better IDE support:

```ts
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import type { Options } from '@dicebear/core';

const options: Options = {
  seed: 'John Doe',
  backgroundColor: ['b6e3f4'],
  // ... other options
};

const avatar = createAvatar(lorelei, options);
```

Each style also exports its own options type for style-specific options.

## Convert to other formats

Need PNG, JPEG, or other formats? Check out the
[Converter](/how-to-use/js-library/converter/) package.
