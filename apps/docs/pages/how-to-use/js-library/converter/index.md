---
title: Converter – 将 SVG 头像转换为 PNG、JPEG 等格式 | DiceBear
description: >
  了解如何在你的项目中使用 DiceBear Converter 库，将 SVG
  转换为 PNG 或 JPEG。可在浏览器和 Node.js 中使用！
---

# Converter

有时你需要的头像格式不是 SVG。为此我们创建了一个名为 `@dicebear/converter` 的包，它可以将头像转换为
PNG、JPEG、WebP 和 AVIF。

## 安装

```
npm install @dicebear/converter
```

::: tip

使用转换器包时，你不需要安装核心库 `@dicebear/core`。虽然它是为 DiceBear 优化的，但也可以与来自
其他来源的 SVG 一起使用。

:::

## 用法

虽然转换器可以在不依赖核心库的情况下使用，但在我们的示例中，我们使用它来创建头像。

```js
import { toPng } from '@dicebear/converter';
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John Doe',
  // ... 其他选项
});

const png = toPng(avatar);
const dataUri = await png.toDataUri();
```

## 支持的格式

| 格式   | 函数      | 浏览器 | Node.js | 说明                                 |
| ------ | --------- | ------ | ------- | ------------------------------------ |
| PNG    | `toPng`   | 是     | 是      | 完全支持                             |
| JPEG   | `toJpeg`  | 是     | 是      | 完全支持                             |
| WebP   | `toWebp`  | 是\*   | 是      | 不支持的浏览器会回退到 PNG           |
| AVIF   | `toAvif`  | 是\*   | 是      | 不支持的浏览器会回退到 PNG           |

\* WebP 在所有现代浏览器中都受支持。AVIF 支持因浏览器而异 - 请查看
[caniuse.com](https://caniuse.com/avif) 了解当前浏览器兼容性。

## 方法

### `toPng(svg, options)`

**返回类型：** 包含 [.toDataUri()](#todatauri) 和
[.toArrayBuffer()](#toarraybuffer) 方法的对象。

将头像从 SVG 转换为 PNG。第一个参数期望传入 SVG `string` 或带有
`toString` 方法的 `object`。还可选择性地传入类型为 `object` 的 `options` 参数。更多信息请参见
[选项](#options)。

<!-- prettier-ignore -->
```js
import { toPng } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const png = toPng(svg, {
  // ... 选项
});
```

### `toJpeg(svg, options)`

**返回类型：** 包含 [.toDataUri()](#todatauri) 和
[.toArrayBuffer()](#toarraybuffer) 方法的对象。

将头像从 SVG 转换为 JPEG。第一个参数期望传入 SVG `string` 或带有
`toString` 方法的 `object`。还可选择性地传入类型为 `object` 的 `options` 参数。更多信息请参见
[选项](#options)。

<!-- prettier-ignore -->
```js
import { toJpeg } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const jpeg = toJpeg(svg, {
  // ... 选项
});
```

### `toWebp(svg, options)`

**返回类型：** 包含 [.toDataUri()](#todatauri) 和
[.toArrayBuffer()](#toarraybuffer) 方法的对象。

将头像从 SVG 转换为 WebP。第一个参数期望传入 SVG `string` 或带有
`toString` 方法的 `object`。还可选择性地传入类型为 `object` 的 `options` 参数。更多信息请参见
[选项](#options)。

<!-- prettier-ignore -->
```js
import { toWebp } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const webp = toWebp(svg, {
  // ... 选项
});
```

::: warning 浏览器支持有限

此函数在浏览器中使用 HTML canvas 元素，并依赖浏览器能够将 canvas 导出为 WebP。如果浏览器不支持
WebP，则会回退使用 PNG。有关浏览器兼容性，请参见
[MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)。

:::

### `toAvif(svg, options)`

**返回类型：** 包含 [.toDataUri()](#todatauri) 和
[.toArrayBuffer()](#toarraybuffer) 方法的对象。

将头像从 SVG 转换为 AVIF。第一个参数期望传入 SVG `string` 或带有
`toString` 方法的 `object`。还可选择性地传入类型为 `object` 的 `options` 参数。更多信息请参见
[选项](#options)。

<!-- prettier-ignore -->
```js
import { toAvif } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const avif = toAvif(svg, {
  // ... 选项
});
```

::: warning 浏览器支持有限

此函数在浏览器中使用 HTML canvas 元素，并依赖浏览器能够将 canvas 导出为 AVIF。如果浏览器不支持
AVIF，则会回退使用 PNG。有关浏览器兼容性，请参见
[MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)。

:::

### `.toDataUri()`

**返回类型：** `Promise<string>`

返回图片的
[data URI](https://en.wikipedia.org/wiki/Data_URI_scheme)。这对于直接在 HTML 或 CSS 中嵌入图片很有用。

```js
import { toPng } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const png = toPng(svg, {
  // ... 选项
});
const dataUri = await png.toDataUri(); // [!code focus]

// 在 HTML 中使用：<img src={dataUri} alt="Avatar" />
```

### `.toArrayBuffer()`

**返回类型：** `Promise<ArrayBuffer>`

将图片转换为
[ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)。
这对于保存文件或发送二进制数据很有用。

```js
import { toPng } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const png = toPng(svg, {
  // ... 选项
});
const buffer = await png.toArrayBuffer(); // [!code focus]
```

## 选项 

| 选项          | 类型       | 默认值   | 环境              | 描述                                  |
| ------------- | ---------- | ------- | ----------------- | ------------------------------------- |
| `size`        | `number`   | `512`   | Browser + Node.js | 输出图像尺寸（像素）（最大：`2048`）  |
| `fonts`       | `string[]` | `[]`    | Node.js           | 自定义字体文件路径                    |
| `includeExif` | `boolean`  | `false` | Node.js           | 在输出图像中包含元数据                |

### size

**类型：** `number`

**默认值：** `512`

**最大值：** `2048`

控制光栅化输出图像的宽度和高度，单位为像素。输出始终是正方形。高于 `2048` 的值会被限制为 `2048`。无效值
（`NaN`、`<= 0`、`Infinity`）会回退到 `512`。


```js
import { toPng } from '@dicebear/converter';

const png = toPng(svg, {
  size: 128,
});
```

### fonts <Badge type="warning" text="仅 Node.js" />

**类型：** `string[]`

**默认值：** `[]`

一个字体文件路径数组，这些字体将用于渲染头像。如果未设置，将使用系统字体。这对于
[initials](/styles/initials/) 样式或其他渲染文本的样式尤其有用。

```js
import { toPng } from '@dicebear/converter';

const png = toPng(svg, {
  fonts: ['/path/to/custom-font.ttf'],
});
```

### includeExif <Badge type="warning" text="仅 Node.js" />

**类型：** `boolean`

**默认值：** `false`

如果设置为 `true`，转换器会尝试从 SVG 中读取元数据，并将其作为 Exif 元数据添加到输出图像中。这对于保留
许可和署名信息很有用。

会提取并嵌入以下元数据：

- **标题** - 头像样式标题
- **来源** - 源 URL
- **创建者** - 艺术家/创建者名称
- **许可证** - 许可证信息
- **版权** - 版权声明

```js
import { toPng } from '@dicebear/converter';

const png = toPng(svg, {
  includeExif: true,
});
```

::: warning

这使用了一个 `exiftool` 单例，需要在应用程序终止时手动退出。更多信息请参见
[exiftool-vendored documentation](https://www.npmjs.com/package/exiftool-vendored)。

```js
import { exiftool } from 'exiftool-vendored';

// 当你的应用程序退出时：
await exiftool.end();
```

:::

## 示例

### 将 DiceBear 头像转换为 PNG

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };
import { toPng } from '@dicebear/converter';

const avatar = new Avatar(lorelei, {
  seed: 'John Doe',
  backgroundColor: ['#b6e3f4'],
});

const png = toPng(avatar);
const dataUri = await png.toDataUri();

// 在浏览器中使用
document.querySelector('img').src = dataUri;
```

### 将头像保存到文件（Node.js）

```js
import { Avatar } from '@dicebear/core';
import bottts from '@dicebear/definitions/bottts.json' with { type: 'json' };
import { toPng } from '@dicebear/converter';
import { writeFile } from 'node:fs/promises';

const avatar = new Avatar(bottts, {
  seed: 'robot-42',
});

const png = toPng(avatar);
const buffer = await png.toArrayBuffer();

await writeFile('avatar.png', Buffer.from(buffer));
```

### 使用 Exif 元数据进行转换（Node.js）

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };
import { toPng } from '@dicebear/converter';
import { exiftool } from 'exiftool-vendored';
import { writeFile } from 'node:fs/promises';

const avatar = new Avatar(lorelei, {
  seed: 'John Doe',
});

const png = toPng(avatar, {
  includeExif: true,
});

const buffer = await png.toArrayBuffer();
await writeFile('avatar.png', Buffer.from(buffer));

// 重要：完成后关闭 exiftool
await exiftool.end();
```

### 使用自定义字体（Node.js）

```js
import { Avatar } from '@dicebear/core';
import initials from '@dicebear/definitions/initials.json' with { type: 'json' };
import { toPng } from '@dicebear/converter';

const avatar = new Avatar(initials, {
  seed: 'John Doe',
});

const png = toPng(avatar, {
  fonts: ['/path/to/Roboto-Bold.ttf'],
});

const dataUri = await png.toDataUri();
```

### 使用自定义尺寸进行转换

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };
import { toPng } from '@dicebear/converter';

const avatar = new Avatar(lorelei, { seed: 'John Doe' });

const png = toPng(avatar, { size: 128 });
const dataUri = await png.toDataUri();
```

### 转换任意 SVG（不使用 DiceBear）

```js
import { toPng } from '@dicebear/converter';

const svg = `
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" fill="red" />
  </svg>
`;

const png = toPng(svg);
const dataUri = await png.toDataUri();
```

## TypeScript

该库具有完整的类型支持：

```ts
import { toPng, toJpeg, toWebp, toAvif } from '@dicebear/converter';
import type { Options, Result } from '@dicebear/converter';

const options: Options = {
  includeExif: true,
};

const result: Result = toPng(svg, options);
const buffer: ArrayBuffer = await result.toArrayBuffer();
```
