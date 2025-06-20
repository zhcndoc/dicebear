---
description: >
  Learn how to use the DiceBear Converter library in your project to convert SVG
  to PNG or JPEG. Works in the browser and in Node.js!
---

# Converter

Sometimes you need the avatar in a different format than SVG. For this we have
created a package called `@dicebear/converter` which can convert the avatar to
PNG and JPEG.

## Installation

```
npm install @dicebear/converter
```

::: tip

You don't need to install the core library `@dicebear/core` to use the converter
package. While it is optimized for DiceBear, it can also be used with SVGs from
other sources.

:::

## Usage

Although the converter can be used without the core library, we use it in our
example to create the avatar.

```js
import { toPng } from '@dicebear/converter';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  seed: 'John Doe',
  // ... other options
});

const png = toPng(avatar, {
  // ... options
});
```

## Methods

### `toPng(svg, options)`

**Return type:** Object with [.toDataUri()](#todatauri) and
[.toArrayBuffer()](#toarraybuffer) methods.

Converts the avatar from SVG to PNG. Expects an SVG `string` or an `object` with
`toString` method as first argument. Expects an optional `options` argument of
type `object`. See [options](#options) for more information.

<!-- prettier-ignore -->
```js
import { toJpeg } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const png = toJpeg(svg, {
  // ... options
});
```

### `toJpeg(svg, options)`

**Return type:** Object with [.toDataUri()](#todatauri) and
[.toArrayBuffer()](#toarraybuffer) methods.

Converts the avatar from SVG to JPEG. Expects an SVG `string` or an `object`
with `toString` method as first argument. Expects an optional `options` argument
of type `object`. See [options](#options) for more information.

<!-- prettier-ignore -->
```js
import { toJpeg } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const jpeg = toJpeg(svg, {
  // ... options
});
```

### `toWebp(svg, options)`

**Return type:** Object with [.toDataUri()](#todatauri) and
[.toArrayBuffer()](#toarraybuffer) methods.

Converts the avatar from SVG to WEBP. Expects an SVG `string` or an `object`
with `toString` method as first argument. Expects an optional `options` argument
of type `object`. See [options](#options) for more information.

<!-- prettier-ignore -->
```js
import { toWebp } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const png = toWebp(svg, {
  // ... options
});
```

::: warning Limited browser support

This function uses an HTML canvas element in the browser and is dependent on the
browser being able to export the canvas as a WebP. If the browser does not
support WebP, PNG is usually used as a fallback. See
[mdn web docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
for more information.

:::

### `toAvif(svg, options)`

**Return type:** Object with [.toDataUri()](#todatauri) and
[.toArrayBuffer()](#toarraybuffer) methods.

Converts the avatar from SVG to AVIF. Expects an SVG `string` or an `object`
with `toString` method as first argument. Expects an optional `options` argument
of type `object`. See [options](#options) for more information.

<!-- prettier-ignore -->
```js
import { toWebp } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const png = toWebp(svg, {
  // ... options
});
```

::: warning Limited browser support

This function uses an HTML canvas element in the browser and is dependent on the
browser being able to export the canvas as a AVIF. If the browser does not
support AVIF, PNG is usually used as a fallback. See
[mdn web docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
for more information.

:::

### `.toDataUri()`

**Return type:** `Promise<string>`

Returns the avatar as [data uri](https://en.wikipedia.org/wiki/Data_URI_scheme).

```js
import { toPng } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const png = toPng(svg, {
  // ... options
});

const dataUri = await png.toDataUri(); // [!code focus]
```

### `.toArrayBuffer()`

**Return type:** `Promise<ArrayBuffer>`

Converts the avatar to an
[ArrayBuffer](https://developer.mozilla.org/en-US/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

```js
import { toPng } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const png = toPng(svg, {
  // ... options
});

const dataUri = await png.toArrayBuffer(); // [!code focus]
```

## Options

### fonts <Badge type="warning" text="Node.js only" />

**Type:** `string[]`

**Default:** `[]`

An array of paths to font files which should be used to render the avatar. If
not set, the system fonts will be used.

### includeExif <Badge type="warning" text="Node.js only" />

**Type:** `boolean`

**Default:** `false`

If set to `true`, the converter will try to read the metadata from the SVG and
add it to the PNG or JPEG. This is useful if you want to add license information
to the image.

::: warning

This uses an `exiftool` singleton which needs to be exited manually. See the
[documentation](https://www.npmjs.com/package/exiftool-vendored#usage) for more
information.

:::
