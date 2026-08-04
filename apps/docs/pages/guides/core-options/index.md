---
title: 核心选项
description: >
  每个 DiceBear 核心都支持的选项，适用于 JavaScript、PHP、Python、Rust、Go
  和 Dart 库以及 HTTP API：seed、flip、rotate、scale、size、background，以及
  每个组件和颜色的选项。
---

# 核心选项

这些选项在每个 DiceBear 核心中都相同：JavaScript、PHP、Python、Rust、Go
和 Dart 库，以及 [HTTP API](/how-to-use/http-api/)。不同语言之间只有传递
这些选项的方式不同，因此每个库的页面都会以其自身的语法展示。以下选项的名称、
类型、默认值和行为都不会改变。

它们适用于每种头像样式。当类型列出 `[min, max]` 时，你可以传入固定值或包含
两个元素的元组。PRNG 会从元组的范围内采样一个值。

| 选项              | 类型                                             | 默认值        | 描述                                                                                                                                        |
| ----------------- | ------------------------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `seed`            | `string`                                         | `''`          | 用于确定性生成的种子                                                                                                                        |
| `flip`            | `'none' \| 'horizontal' \| 'vertical' \| 'both'` | `'none'`      | 翻转头像（接受值数组以进行随机化）                                                                                                          |
| `rotate`          | `number \| [min, max]`                           | `0`           | 旋转角度（−360 至 360）                                                                                                                     |
| `scale`           | `number \| [min, max]`                           | `1`           | 围绕画布中心的统一缩放比例（0 至 10；`1` 表示原始大小）                                                                                    |
| `borderRadius`    | `number \| [min, max]`                           | `0`           | 画布百分比形式的边框半径（0 至 50；`50` 会生成圆形）                                                                                        |
| `size`            | `integer`                                        | _未设置_      | 输出尺寸（像素）（1 至 4096）；未设置时 SVG 会缩放以适应其容器                                                                              |
| `translateX`      | `number \| [min, max]`                           | `0`           | 相对于画布宽度的水平位移百分比（−1000 至 1000）                                                                                            |
| `translateY`      | `number \| [min, max]`                           | `0`           | 相对于画布高度的垂直位移百分比（−1000 至 1000）                                                                                            |
| `idRandomization` | `boolean`                                        | `false`       | 为每个 SVG `id` 添加随机的非确定性值（当多个头像共享同一页面时避免 `url(#…)` 冲突）                                                           |
| `title`           | `string`                                         | _未设置_      | 无障碍标题；设置后，SVG 会变为 `role="img"` 并包含 `<title>`                                                                                |
| `fontFamily`      | `string \| string[]`                             | `'system-ui'` | 基于文本的样式所使用的字体系列（CSS 样式的字体栈，不含引号）                                                                                |
| `fontWeight`      | `integer \| integer[]`                           | `400`         | 基于文本的样式所使用的字体粗细（1 至 1000）                                                                                                |
| `tags`            | `string \| string[]`                             | _未设置_      | 仅保留匹配这些 [标签](/guides/filter-variants-with-tags/) 的变体（`category` 或 `category:value`，添加 `!` 前缀表示排除）                    |

## 背景选项

这些选项适用于每种样式，即使其定义中没有声明
`background` 颜色组。

| 选项                      | 类型                              | 默认值    | 描述                                                               |
| ------------------------- | --------------------------------- | --------- | ------------------------------------------------------------------ |
| `backgroundColor`         | `string \| string[]`              | _未设置_  | 以十六进制表示的背景颜色（可省略 `#`，范围从 `#RGB` 到 `#RRGGBBAA`） |
| `backgroundColorFill`     | `'solid' \| 'linear' \| 'radial'` | `'solid'` | 背景填充类型（接受值数组以进行随机化）                             |
| `backgroundColorFillStops` | `integer \| [min, max]`           | `2`       | 渐变停止点数量（最少为 2）；填充为 `solid` 时忽略                 |
| `backgroundColorAngle`    | `number \| [min, max]`            | `0`       | 以度为单位的渐变角度（−360 至 360）                               |

## 动态组件选项

对于样式中的每个组件（例如 `eyes`、`mouth`、`hair`），都有以下选项可用：

| 模式                      | 类型                                        | 描述                                             |
| ------------------------- | ------------------------------------------- | ------------------------------------------------ |
| `{component}Variant`      | `string \| string[] \| { variant: weight }` | 限制为特定变体，可选择性地设置权重                 |
| `{component}Probability`  | `number`                                    | 可见概率，单位为百分比（0 到 100）                |

组件的旋转、平移和缩放会在渲染时根据组件定义进行采样，**不是**用户选项：不存在
`{component}Rotate`、`{component}TranslateX`、`{component}TranslateY` 或
`{component}Scale` 选项。

组件别名（通过样式定义中的 `extends` 声明）不会公开自己的选项键。它们与其扩展的组件共享
`{source}Variant` 和 `{source}Probability`。

## 动态颜色选项

对于样式中的每个颜色组（例如 `skin`、`hair`）和 `background`，以下选项可用：

| 模式                    | 类型                              | 描述                                                               |
| ----------------------- | --------------------------------- | ------------------------------------------------------------------ |
| `{color}Color`          | `string \| string[]`              | 使用十六进制值覆盖调色板（`#` 可选）                               |
| `{color}ColorFill`      | `'solid' \| 'linear' \| 'radial'` | 填充类型（接受值数组以进行随机化）                                 |
| `{color}ColorFillStops` | `integer \| [min, max]`           | 渐变色标数量（最少为 2）；当填充为 `solid` 时忽略                  |
| `{color}ColorAngle`     | `number \| [min, max]`            | 渐变角度，单位为度（−360 至 360）                                  |

## 变体标签

当一个样式为其变体添加标签时，`tags` 选项会一次性在所有组件中，将变体池筛选为你想要的特征。标签可以是 `category` 或 `category:value`，例如 `animation` 或 `hairLength:long`。同一类别中的值以“或”组合，不同类别以“且”组合，不带值的类别表示必须具备该特征，而前置 `!` 表示不允许具备该特征。有关完整规则以及 DiceBear 样式所使用的类别，请参阅[使用标签筛选变体](/guides/filter-variants-with-tags/)。
