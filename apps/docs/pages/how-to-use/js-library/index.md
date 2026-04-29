---
title: JavaScript Avatar Library – 浏览器与 Node.js
description: >
  使用 DiceBear JavaScript 头像库在浏览器（原生 JS）、React、Vue、Angular、Svelte 和 Node.js 中生成 SVG 个人资料图片。包含 TypeScript 支持。
---

# JavaScript 头像库

该库使用 [TypeScript](https://www.typescriptlang.org/) /
[JavaScript](https://developer.mozilla.org/en-US/Web/JavaScript) 编写，可在浏览器中使用，也可在 [Node.js](https://nodejs.org/en/)（22 版或更高）中使用。在其他环境中，你可能会对 [PHP Library](/how-to-use/php-library/)、
[HTTP API](/how-to-use/http-api/) 或 [CLI](/how-to-use/cli/) 感兴趣。

该库是一个纯 [ESM package](https://developer.mozilla.org/en-US/Web/JavaScript/Guide/Modules)。
如果你是 ESM package 新手， [Sindre Sorhus](https://github.com/sindresorhus) 写了一份很棒的 [帮助页面](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)。

## 安装

你需要两个包：核心库 `@dicebear/core` 和头像样式定义 `@dicebear/definitions`。

```
npm install @dicebear/core @dicebear/definitions
```

## 使用

我们在示例中使用头像样式 [lorelei](/styles/lorelei/)。你可以在 [这里](/styles/) 找到更多头像样式。

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John Doe',
  // ... 其他选项
});

const svg = avatar.toString();
```

每种头像样式都带有若干选项。你可以在每个 [头像样式](/styles/) 的详情页找到它们。

::: tip

如果你想将该库集成到某个框架中，请查看我们为 [Angular](/guides/use-the-library-with-angular/)、
[React](/guides/use-the-library-with-react/)、
[React Native](/guides/use-the-library-with-react-native/)、
[Vue](/guides/use-the-library-with-vue/) 或
[Svelte](/guides/use-the-library-with-svelte/) 提供的指南。

:::

:::info

我们提供了来自不同艺术家的大量头像样式。这些头像样式采用不同的许可证，艺术家可以自行选择。为了快速概览，我们为你创建了一个 [许可证概览](/licenses/)。

:::

## 确定性头像

`seed` 选项是生成确定性头像的关键。相同的 seed 始终会生成相同的头像，这使它非常适合用户资料：

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

// 这些将始终生成相同的头像
const avatar1 = new Avatar(lorelei, { seed: 'user-123' });
const avatar2 = new Avatar(lorelei, { seed: 'user-123' });

avatar1.toString() === avatar2.toString(); // true
```

## 类

### `Avatar`

用于生成头像的主类。接受样式定义（或 `Style` 实例）以及可选选项。

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, { // [!code focus:3]
  // ... 选项
});
```

### `Style`

样式定义的不可变封装。当前你想在多个头像之间复用同一个已解析的样式，而无需每次重新解析时使用它。

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const style = new Style(lorelei); // [!code focus:4]

const avatar1 = new Avatar(style, { seed: 'Alice' });
const avatar2 = new Avatar(style, { seed: 'Bob' });
```

### `OptionsDescriptor`

描述给定样式的所有有效选项。适用于构建 UI 或验证用户输入。详情请参见
[访问样式选项](/guides/access-all-available-options/)。

## 方法

### `.toString()`

**返回类型：** `string`

以 XML 格式返回 SVG 头像。

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  // ... 选项
});

const svg = avatar.toString(); // [!code focus]
```

### `.toJSON()`

**返回类型：** `{ svg: string, options: StyleOptions }`

返回一个对象，包含用于生成头像的 SVG 和已解析选项。

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John Doe',
  // ... 其他选项
});

const json = avatar.toJSON(); // [!code focus]

// 示例输出：
// {
//   svg: '<svg>...</svg>',
//   options: {
//     seed: 'John Doe',
//     // ... 已解析选项
//   }
// }
```

### `.toDataUri()`

**返回类型：** `string`

返回 [data uri](https://en.wikipedia.org/wiki/Data_URI_scheme) 形式的头像。
这对于直接将头像嵌入 HTML 或 CSS 非常有用。

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John Doe',
  // ... 其他选项
});

const dataUri = avatar.toDataUri(); // [!code focus]

// 在 HTML 中使用
// <img src={dataUri} alt="头像" />
```

## 核心选项

这些选项适用于所有头像样式：

| 选项                | 类型                                              | 默认值      | 描述                                         |
| ------------------- | ------------------------------------------------- | ----------- | -------------------------------------------- |
| `seed`              | `string`                                          | `''`        | 用于确定性生成的种子                           |
| `flip`              | `'none' \| 'horizontal' \| 'vertical' \| 'both'` | `'none'`    | 翻转头像                                     |
| `rotate`            | `number \| [min, max]`                            | `0`         | 旋转头像（-360 到 360 度）                     |
| `scale`             | `number \| [min, max]`                            | `1`         | 缩放头像                                     |
| `borderRadius`      | `number \| [min, max]`                            | `0`         | 圆角半径（0-50%，50 = 圆形）                   |
| `size`              | `number`                                          | _undefined_ | 固定像素尺寸                                 |
| `translateX`        | `number \| [min, max]`                            | `0`         | 水平平移（-100 到 100 百分比）                |
| `translateY`        | `number \| [min, max]`                            | `0`         | 垂直平移（-100 到 100 百分比）                |
| `idRandomization`   | `boolean`                                         | `false`     | 随机化 SVG 元素 ID                           |
| `title`             | `string`                                          | _undefined_ | SVG 的可访问标题                             |
| `fontFamily`        | `string \| string[]`                              | `'system-ui'` | 文本类样式的字体族                        |
| `fontWeight`        | `number \| number[]`                              | `400`       | 文本类样式的字体粗细（1-1000）                |

### 背景选项

| 选项                      | 类型                                    | 默认值      | 描述                                |
| ------------------------- | --------------------------------------- | ----------- | ----------------------------------- |
| `backgroundColor`         | `string \| string[]`                    | _undefined_ | 背景颜色（带 # 的十六进制）           |
| `backgroundColorFill`     | `'solid' \| 'linear' \| 'radial'`      | `'solid'`   | 背景填充类型                          |
| `backgroundColorFillStops`| `number \| [min, max]`                  | _undefined_ | 渐变色标数量                          |
| `backgroundColorAngle`    | `number \| [min, max]`                  | _undefined_ | 渐变角度（-360 到 360 度）            |

### 动态组件选项

对于样式中的每个组件（例如 `eyes`、`mouth`、`hair`），都可使用以下选项：

| 模式                      | 类型                                   | 描述                              |
| ------------------------- | -------------------------------------- | --------------------------------- |
| `{component}Variant`      | `string \| string[] \| Record<string, number>` | 选择特定变体或设置权重 |
| `{component}Probability`  | `number`                               | 可见概率（0-100）                   |
| `{component}Rotate`       | `number \| [min, max]`                 | 组件旋转（-360 到 360）             |
| `{component}TranslateX`   | `number \| [min, max]`                 | 组件水平偏移（-100 到 100）         |
| `{component}TranslateY`   | `number \| [min, max]`                 | 组件垂直偏移（-100 到 100）         |

### 动态颜色选项

对于样式中的每个颜色组（例如 `skin`、`hair`）以及 `background`，都可使用以下选项：

| 模式                      | 类型                                    | 描述                              |
| ------------------------- | --------------------------------------- | --------------------------------- |
| `{color}Color`            | `string \| string[]`                    | 覆盖颜色调色板（带 # 的十六进制）   |
| `{color}ColorFill`        | `'solid' \| 'linear' \| 'radial'`      | 颜色填充类型                        |
| `{color}ColorFillStops`   | `number \| [min, max]`                  | 渐变色标数量                        |
| `{color}ColorAngle`       | `number \| [min, max]`                  | 渐变角度（-360 到 360 度）          |

## 示例

### 带自定义背景的头像

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John Doe',
  backgroundColor: ['#b6e3f4', '#c0aede', '#d1d4f9'],
  // ... 其他选项
});
```

### 固定尺寸头像

```js
import { Avatar } from '@dicebear/core';
import bottts from '@dicebear/definitions/bottts.json' with { type: 'json' };

const avatar = new Avatar(bottts, {
  seed: 'robot-42',
  size: 128,
  borderRadius: 50, // 圆形头像
  // ... 其他选项
});
```

### 带变换的头像

```js
import { Avatar } from '@dicebear/core';
import avataaars from '@dicebear/definitions/avataaars.json' with { type: 'json' };

const avatar = new Avatar(avataaars, {
  seed: 'Jane Doe',
  flip: 'horizontal',
  rotate: 10,
  scale: 90,
  translateY: 5,
  // ... 其他选项
});
```

### 同一页面上的多个头像

在同一页面渲染多个头像时，使用 `idRandomization` 以防止 SVG ID 冲突：

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const users = ['alice', 'bob', 'charlie'];

const avatars = users.map((user) =>
  new Avatar(lorelei, {
    seed: user,
    idRandomization: true,
    // ... 其他选项
  }).toString(),
);
```

### 带权重的变体选择

你可以通过传入权重映射来影响 PRNG，使其更偏好某些变体：

```js
import { Avatar } from '@dicebear/core';
import avataaars from '@dicebear/definitions/avataaars.json' with { type: 'json' };

const avatar = new Avatar(avataaars, {
  seed: 'John Doe',
  topVariant: { short01: 2, short02: 2, long01: 1 },
  // ... 其他选项
});
```

## TypeScript

该库是完全类型化的。你可以导入类型以获得更好的 IDE 支持：

```ts
import { Avatar, Style } from '@dicebear/core';
import type { StyleOptions, StyleDefinition } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John Doe',
  backgroundColor: ['#b6e3f4'],
  // ... 其他选项
});
```

当将样式定义作为 JSON 导入时，TypeScript 会推断该定义的字面量类型，为组件和颜色选项名称提供自动补全。

## 转换为其他格式

需要 PNG、JPEG 或其他格式吗？请查看
[Converter](/how-to-use/js-library/converter/) 包。
