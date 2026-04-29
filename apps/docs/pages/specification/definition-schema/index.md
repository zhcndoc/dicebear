---
title: Definition Schema Reference | DiceBear
description: >
  DiceBear 头像样式定义 schema 的完整参考。了解
  样式定义如何使用 canvas、components、colors 和 metadata 进行结构化组织。
---

# 定义 Schema 参考

每个 DiceBear 头像样式都是一个遵循
[DiceBear Definition Schema](https://github.com/dicebear/schema) 的 JSON 文件。此页面
记录了样式定义的完整结构。

## 概览

样式定义描述了生成头像所需的一切：canvas
尺寸、要渲染的 SVG 元素、可随机化的组件，以及可用的
颜色调色板。该定义完全是声明式的——没有代码，没有
函数。渲染逻辑位于 DiceBear Core 的实现中。

## 顶层结构

```json
{
  "$schema": "https://...",
  "$comment": "可选注释",
  "meta": { ... },
  "canvas": { ... },
  "components": { ... },
  "colors": { ... },
  "attributes": { ... }
}
```

| 属性         | 必需 | 描述                                         |
| ------------ | ---- | -------------------------------------------- |
| `$schema`    | 否   | 用于验证的定义 schema URL                   |
| `$comment`   | 否   | 自由文本注释（例如：“由 Figma 生成”）       |
| `meta`       | 否   | 许可证、创建者和来源元数据                   |
| `canvas`     | **是** | canvas 尺寸和根元素树                        |
| `components` | 否   | 命名的、可随机化的 SVG 组件                  |
| `colors`     | 否   | 用于动态着色的命名颜色调色板                |
| `attributes` | 否   | 应用于根元素的全局 SVG 属性                  |

## `meta`

关于样式的元数据——用于许可证注释、CLI 横幅以及
文档。

```json
{
  "meta": {
    "license": {
      "name": "CC0 1.0",
      "url": "https://creativecommons.org/publicdomain/zero/1.0/",
      "text": "完整许可证文本..."
    },
    "creator": {
      "name": "DiceBear",
      "url": "https://www.dicebear.com"
    },
    "source": {
      "name": "Initials",
      "url": "https://github.com/dicebear/dicebear"
    }
  }
}
```

## `canvas`

定义 SVG 视口和根元素树。`width` 和 `height`
决定生成的 SVG 的 `viewBox`。

```json
{
  "canvas": {
    "width": 100,
    "height": 100,
    "elements": [
      { "type": "component", "name": "background" },
      { "type": "component", "name": "face" }
    ]
  }
}
```

| 属性       | 类型   | 必需 | 描述                           |
| ---------- | ------ | ---- | ------------------------------ |
| `width`    | number | **是** | canvas 宽度（像素，>= 1）      |
| `height`   | number | **是** | canvas 高度（像素，>= 1）      |
| `elements` | array  | **是** | 根元素树                       |

## Elements

Elements 是 SVG 的构建块。支持三种类型：

### `element` — SVG 标签

渲染一个 SVG 元素，例如 `<circle>`、`<path>`、`<g>` 等。

```json
{
  "type": "element",
  "name": "circle",
  "attributes": {
    "cx": "50",
    "cy": "50",
    "r": "40",
    "fill": { "type": "color", "name": "skin" }
  },
  "children": []
}
```

仅允许
[白名单中的 SVG 元素](https://github.com/dicebear/schema/blob/main/src/definition.json)
（例如 `circle`、`path`、`g`、`rect`、`text`、`defs`、`filter`、
`linearGradient`、`radialGradient` 等）。像 `script`、
`foreignObject` 和事件处理器这样的元素会出于安全原因被阻止。

### `text` — 文本内容

在 SVG 元素内渲染原始文本。支持变量引用。

```json
{
  "type": "text",
  "value": "Hello"
}
```

或者使用变量：

```json
{
  "type": "text",
  "value": { "type": "variable", "name": "initials" }
}
```

### `component` — 组件引用

引用在 `components` 部分定义的命名组件。DiceBear
Core 会根据种子和选项选择一个变体。

```json
{
  "type": "component",
  "name": "eyes"
}
```

## `components`

头像中可命名、可随机化的部分。每个组件定义了一组
PRNG 可以选择的变体。

```json
{
  "components": {
    "eyes": {
      "width": 80,
      "height": 40,
      "probability": 100,
      "rotate": [-10, 10],
      "translate": {
        "x": [0, 0],
        "y": [-5, 5]
      },
      "variants": {
        "happy": {
          "weight": 1,
          "elements": [...]
        },
        "surprised": {
          "weight": 1,
          "elements": [...]
        }
      }
    }
  }
}
```

| 属性          | 类型   | 默认值 | 描述                                   |
| ------------- | ------ | ------ | -------------------------------------- |
| `width`       | number | —      | 组件 canvas 宽度（必需）               |
| `height`      | number | —      | 组件 canvas 高度（必需）               |
| `probability` | number | `100`  | 组件出现的概率（0-100）                |
| `rotate`      | array  | —      | `[min, max]` 的旋转范围，单位为度     |
| `translate`   | object | —      | `{ x: [min, max], y: [min, max] }` 偏移量，以组件 canvas 尺寸的百分比表示（-200 到 200） |
| `variants`    | object | —      | 命名的变体定义（必需）                 |

`translate.x` 表示为组件宽度的百分比，`translate.y` 表示为组件高度的百分比。值 `100`
对应一个完整的 canvas 维度，与面向用户的 `translateX` / `translateY` 选项语义一致。因此上面的示例（`y: [-5, 5]`）意味着“在任一方向上，按组件高度的最多 5 % 垂直移动组件”。

### Variants

每个变体包含一个元素树和一个可选的权重：

| 属性       | 类型   | 默认值 | 描述                                   |
| ---------- | ------ | ------ | -------------------------------------- |
| `elements` | array  | —      | 此变体的 SVG 元素树（必需）            |
| `weight`   | number | `1`    | PRNG 的选择权重                         |

权重越高，某个变体被选中的可能性就越大。权重为 `0` 表示
只有当其他所有变体也都为 `0` 时才会选择该变体。

## `colors`

命名颜色调色板。PRNG 会根据种子从调色板中选择一种颜色。

```json
{
  "colors": {
    "skin": {
      "values": ["#f5d6c3", "#d4a889", "#a67c5b", "#614335"]
    },
    "text": {
      "values": ["#ffffff", "#000000"],
      "contrastTo": "skin"
    },
    "hair": {
      "values": ["#2c1b18", "#b58143", "#d6b370", "#724133"],
      "notEqualTo": ["skin"]
    }
  }
}
```

| 属性         | 类型     | 描述                                              |
| ------------ | -------- | ------------------------------------------------- |
| `values`     | string[] | 十六进制颜色数组（`#RGB`、`#RRGGBB`、`#RRGGBBAA`） |
| `contrastTo` | string   | 选择与此颜色对比度最高的颜色                      |
| `notEqualTo` | string[] | 过滤掉已被这些颜色组选中的颜色                    |

### 颜色约束

**`contrastTo`** 会绕过随机选择。相反，候选颜色会根据相对于引用颜色的
[WCAG 2.1 对比度](https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio)
进行排序，并选取对比度最高的颜色。这
对于确保文本可读性很有用。

**`notEqualTo`** 会过滤掉已经为
引用颜色组选中的颜色。这可以防止相邻部分具有相同的颜色。

## 属性中的颜色引用

属性可以引用颜色组，而不是硬编码颜色：

```json
{
  "fill": { "type": "color", "name": "skin" }
}
```

这会在渲染时解析为 PRNG 为
`skin` 颜色组选中的颜色。

## 变量引用

文本内容和某些属性支持变量引用：

| 变量         | 描述                                             |
| ------------ | ------------------------------------------------ |
| `initial`    | 从种子派生出的首字母                             |
| `initials`   | 从种子派生出的完整首字母（1-2 个字符）          |
| `fontFamily` | 来自选项的字体族（默认：`system-ui`）            |
| `fontWeight` | 来自选项的字体粗细（默认：`400`）                |

```json
{
  "type": "text",
  "value": { "type": "variable", "name": "initials" }
}
```

## `attributes`

应用于根 `<svg>` 元素的全局 SVG 表现属性。

```json
{
  "attributes": {
    "fill": "none",
    "shape-rendering": "auto"
  }
}
```

仅允许安全的 SVG 表现属性。完整白名单请参见
[schema 源码](https://github.com/dicebear/schema/blob/main/src/definition.json)。

## 示例：最小样式定义

一个完整但最小的定义，渲染一个有颜色的圆形：

```json
{
  "$schema": "https://cdn.hopjs.net/npm/@dicebear/schema@0.9.0/dist/definition.min.json",
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
              "name": "path",
              "attributes": {
                "d": "M 30 60 Q 50 80 70 60",
                "stroke": "#000000",
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
              "name": "line",
              "attributes": {
                "x1": "35",
                "y1": "65",
                "x2": "65",
                "y2": "65",
                "stroke": "#000000",
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
      "values": ["#f9c74f", "#90be6d", "#43aa8b", "#577590", "#f94144"]
    }
  }
}
```

## 验证

使用 `@dicebear/schema` npm 包或任何 JSON Schema Draft 2020-12 验证器，根据 schema 验证定义：

```
npm install @dicebear/schema
```

schema 文件如下：

- **`definition.json`** — 验证样式定义
- **`options.json`** — 验证传递给 `Avatar` 的用户选项

## Schema 包

| 包                   | npm                    | Composer                |
| -------------------- | ---------------------- | ----------------------- |
| Schema               | `@dicebear/schema`     | `dicebear/schema`       |
| Definitions          | `@dicebear/definitions`| `dicebear/definitions`  |
