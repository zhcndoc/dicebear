---
title: 实现 DiceBear Core | DiceBear
description: >
  在任何编程语言中实现 DiceBear Core 的分步指南。
  涵盖 PRNG 契约、选项解析和 SVG 渲染管线。
---

# 实现 DiceBear Core

本指南解释如何在任何编程语言中实现 DiceBear Core。
正确的实现会针对相同的种子和样式定义，生成与
[JavaScript](https://github.com/dicebear/dicebear/tree/10.x/src/js/core) 和
[PHP](https://github.com/dicebear/dicebear/tree/10.x/src/php/core) 参考
实现 **字节完全一致** 的 SVG。

## 架构概览

```
Avatar(definition, options)
  │
  ├── Style        解析并验证定义 JSON
  ├── Options      使用 PRNG 解析选项
  └── Renderer     从解析后的样式 + 选项生成 SVG
        │
        ├── Prng          确定性的随机数生成器
        │   ├── Fnv1a     FNV-1a 32 位哈希
        │   └── Mulberry32  有状态的 PRNG
        │
        └── SVG 输出
```

核心设计刻意保持极简。它接收一个
[样式定义](/specification/definition-schema/) 和用户选项，通过确定性的 PRNG 解析
可随机化的值，并渲染出一个 SVG 字符串。

## PRNG 契约

PRNG 是互操作性的接口。如果你的 PRNG 对相同输入产生与参考实现相同的输出，你的实现就会生成完全一致的 SVG。请先把这一部分做好。

### FNV-1a 32 位哈希

[FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function)
将字符串转换为 32 位无符号整数。DiceBear 遍历的是 **UTF-16 代码单元**（不是字节，也不是码点）。

```
offset_basis = 0x811c9dc5
prime        = 0x01000193

function fnv1a_hash(input: string) -> uint32:
    hash = offset_basis
    for each UTF-16 code unit c in input:
        hash = hash XOR c
        hash = hash * prime  (32-bit multiply, discard overflow)
    return hash as unsigned 32-bit
```

在 JavaScript 中，`input.charCodeAt(i)` 会直接返回 UTF-16 代码单元。
没有原生 UTF-16 字符串的语言必须先进行转换——在基本多文种平面之外（例如 emoji），代码单元和码点会发生分歧，而改用码点会导致这些输入的哈希错误。PHP 参考实现显式进行了转换：

```php
unpack('v*', mb_convert_encoding($input, 'UTF-16LE', 'UTF-8'))
```

Java 和 C# 可以直接遍历 `string.charAt(i)` / `char`。对于其他语言，请转换为 UTF-16 并读取 16 位单元。

**参考（JS）：**

```js
static hash(input) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
```

### Mulberry32

[Mulberry32](https://gist.github.com/tommyettinger/46a874533244883189143505d203312c)
是一种有状态的 PRNG，它将 32 位种子转换为伪随机数序列。实现必须与 Tommy Ettinger 的 C 参考实现完全一致。

```
function mulberry32_next(state) -> (uint32, new_state):
    state = (state + 0x6D2B79F5) as signed 32-bit
    z = state
    z = (z XOR (z >>> 15)) * (z OR 1)    (32-bit multiply)
    z = z XOR (z + ((z XOR (z >>> 7)) * (z OR 61)))  (32-bit multiply)
    return (z XOR (z >>> 14)) as unsigned 32-bit

function mulberry32_next_float(state) -> (float, new_state):
    (value, new_state) = mulberry32_next(state)
    return value / 2^32
```

**参考（JS）：**

```js
next() {
  const z = (this.#state = (this.#state + 0x6d2b79f5) | 0);
  let t = Math.imul(z ^ (z >>> 15), z | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0);
}

nextFloat() {
  return this.next() / 4294967296; // 2^32
}
```

关键细节：

- `| 0` 强制为 32 位有符号整数（处理溢出）
- `>>> 0` 再转换回无符号 32 位
- `Math.imul` 执行 32 位整数乘法
- `nextFloat()` 通过除以 `2^32` 返回 `[0, 1)` 范围内的值
- 状态是 **有状态的**——每次调用 `next()` 都会推进状态
- 拥有 64 位整数但没有原生 `uint32_t` 的语言（例如 PHP、Lua）
  必须手动实现 32 位乘法：天真的 `uint32 * uint32`
  会超过 `2^63 - 1` 并静默溢出。PHP 参考实现将一个
  操作数拆分为 16 位半字；参见 [`Prng/Mulberry32.php::mul`](https://github.com/dicebear/dicebear/blob/10.x/src/php/core/src/Prng/Mulberry32.php)。

### 基于 key 的值生成

DiceBear 不会顺序调用 PRNG。相反，每个随机决策都使用一个 **key** 来派生独立的值。这样输出就与调用顺序无关。

```
function getValue(seed: string, key: string) -> float:
    hash = fnv1a_hash(seed + ":" + key)
    prng = new Mulberry32(hash)
    return prng.nextFloat()
```

例如，`getValue("alice", "eyesVariant")` 总会返回相同的浮点数，
不管 `getValue("alice", "mouthVariant")` 是在之前还是之后被调用。

### 选择方法

所有选择方法在操作前都会使用 UTF-16 代码单元比较（JavaScript 默认的 `.sort()` 顺序）按字符串表示对其输入进行排序。这确保了跨语言确定性。

实际上，唯一会被排序的值是组件变体名称和十六进制颜色字符串——两者都保证是 ASCII。实现可以使用与区域设置无关的字节比较（`strcmp` 风格）并保持结果一致，尽管 JavaScript 参考实现比较的是完整的 UTF-16 代码单元。PHP 参考实现正是通过 `strcmp` 这样做的。

#### `pick(key, items) -> item | undefined`

从数组中选择一个项目。

```
function pick(seed, key, items):
    if items is empty: return undefined
    sorted = sort items by string representation (UTF-16 code unit order)
    if sorted has 1 item: return sorted[0]
    index = floor(getValue(seed, key) * length(sorted))
    return sorted[index]
```

#### `weightedPick(key, entries) -> item | undefined`

从 `[item, weight]` 元组中选择，同时考虑权重。

```
function weightedPick(seed, key, entries):
    if entries is empty: return undefined
    sorted = sort entries by item string representation
    totalWeight = sum of all weights
    if totalWeight == 0: return pick(seed, key, items from entries)
    threshold = getValue(seed, key) * totalWeight
    cumulative = 0
    for each (item, weight) in sorted:
        cumulative += weight
        if cumulative > threshold: return item
    return last item
```

#### `bool(key, likelihood) -> boolean`

以 `likelihood / 100` 的概率返回 `true`。

```
function bool(seed, key, likelihood = 50):
    return getValue(seed, key) * 100 < likelihood
```

#### `float(key, values) -> number | undefined`

返回范围内的浮点数，保留 4 位小数。

```
function float(seed, key, values):
    if values is empty: return undefined
    if values has 1 item: return values[0]
    min = minimum(values)
    max = maximum(values)
    raw = min + getValue(seed, key) * (max - min)
    return round(raw * 10000) / 10000
```

#### `integer(key, values) -> number | undefined`

返回范围内的整数（包含端点）。

```
function integer(seed, key, values):
    if values is empty: return undefined
    if values has 1 item: return values[0]
    min = minimum(values)
    max = maximum(values)
    return floor(getValue(seed, key) * (max - min + 1)) + min
```

#### `shuffle(key, items) -> items[]`

使用一个 **有状态** 的 Mulberry32 实例进行 Fisher-Yates 洗牌（不是基于 key 的）。

```
function shuffle(seed, key, items):
    sorted = sort items by string representation
    result = copy of sorted
    prng = new Mulberry32(fnv1a_hash(seed + ":" + key))
    for i from length(result) - 1 down to 1:
        j = floor(prng.nextFloat() * (i + 1))
        swap result[i] and result[j]
    return result
```

注意：`shuffle` 是唯一一个直接使用有状态 PRNG 实例的方法
（多次调用 `nextFloat()`）。所有其他方法都调用 `getValue()`
，而 `getValue()` 会为每个 key 创建一个新的 PRNG。

## 选项解析

`Options` 类会将原始用户选项解析为渲染器使用的具体值。每次解析都会使用带有特定 key 的 PRNG。

### Core options

| Option            | PRNG key       | Resolution                                                              |
| ----------------- | -------------- | ----------------------------------------------------------------------- |
| `seed`            | —              | 字面字符串；如果未提供，默认为 `''`。不做缓存。         |
| `size`            | —              | 字面数字；默认未设置（渲染器会省略 `width`/`height`）。    |
| `idRandomization` | —              | 布尔值；默认为 `false`。使用宿主 RNG，而不是 DiceBear PRNG。     |
| `title`           | —              | 字面字符串；默认未设置（省略 `<title>`，使用 `aria-hidden`）。 |
| `flip`            | `flip`         | 从 `['none', 'horizontal', 'vertical', 'both']` 中 `pick`，默认 `'none'` |
| `rotate`          | `rotate`       | 范围内的 `float`，默认 `0`                                         |
| `scale`           | `scale`        | 范围内的 `float`，默认 `1`                                         |
| `borderRadius`    | `borderRadius` | 范围内的 `float`，默认 `0`                                         |
| `translateX`      | `translateX`   | 范围内的 `float`，默认 `0`                                         |
| `translateY`      | `translateY`   | 范围内的 `float`，默认 `0`                                         |
| `fontFamily`      | `fontFamily`   | 从数组中 `pick`，默认 `'system-ui'`                                |
| `fontWeight`      | `fontWeight`   | 从数组中 `pick`，默认 `400`                                        |

没有 PRNG key 的选项会直接从用户输入中读取。其余选项则会在给定 key 下，从用户提供的范围/列表中采样，并回退到列出的默认值。

### 组件选项

对于每个组件（例如 `eyes`），用户可以提供恰好两个选项：

| Option              | PRNG key            | Resolution                               |
| ------------------- | ------------------- | ---------------------------------------- |
| `eyesProbability`   | `eyesProbability`   | 具有给定概率的 `bool`，默认来自组件的 `probability`（若未设置则为 `100`） |
| `eyesVariant`       | `eyesVariant`       | 从组件的 variants 中 `weightedPick` |

如果概率检查失败，则组件不会被渲染（variant 返回 `undefined`）。

对于 **组件别名**（在定义中通过 `extends` 声明），选项的行为不同：别名会复用源组件的
`${sourceName}Probability` 用户选项，并且不会暴露自己的
`${aliasName}Probability`。不过，`${aliasName}Variant` 选项
对每个别名都是唯一的——PRNG 会为每个别名采样一个新的 variant。

### 每个组件的变换（渲染时）

每个组件引用在渲染时还会应用旋转、两个平移和缩放。
这些都 **不是用户选项**——它们会在每次渲染时从组件定义的 `rotate`/`translate`/`scale` 范围中采样，
并且 **永远不会出现在 `resolvedOptions` 中**。实现如果要对用户输入进行往返处理，也不得暴露它们。

| Value         | PRNG key            | Sampling                                                            |
| ------------- | ------------------- | ------------------------------------------------------------------- |
| rotate        | `eyesRotate`        | 来自 `component.rotate` 的 `float`，默认 `0`                        |
| translateX    | `eyesTranslateX`    | 来自 `component.translate.x` 的 `float`，默认 `0`                   |
| translateY    | `eyesTranslateY`    | 来自 `component.translate.y` 的 `float`，默认 `0`                   |
| scale         | `eyesScale`         | 来自 `component.scale` 的 `float`，默认 `1`                         |

translate 值是 **组件自身** `width` 和 `height` 的百分比（不是头像画布的百分比）。
先乘以组件尺寸，然后四舍五入到小数点后四位（`round(x * 10000) / 10000`）。用于 rotate 和 scale 的变换中心 `(cx, cy)` 是组件自身的中心——
`(width / 2, height / 2)`。

在输出的 SVG 中，这些值会作为一个单独的 `transform=""` 属性出现在
`<use>` 元素上，且文本顺序如下（从左到右读取）：

```
transform="translate(tx, ty) rotate(angle, cx, cy) translate(cx, cy) scale(s) translate(-cx, -cy)"
```

任何值为恒等变换的片段（`tx=ty=0`、`angle=0`、`s=1`）都会被省略；如果所有片段都是恒等变换，则整个 `transform` 属性完全省略。

### 颜色选项

对于定义中声明的每个颜色组——**加上**一个隐式的
`background` 组——用户可以提供四个选项：

| Option                  | Type                                   | PRNG key                | Notes                                              |
| ----------------------- | -------------------------------------- | ----------------------- | -------------------------------------------------- |
| `${name}Color`          | 十六进制字符串或列表                     | `${name}Color`          | 候选颜色（覆盖定义中的调色板） |
| `${name}ColorFill`      | 枚举 `solid` / `linear` / `radial`     | `${name}ColorFill`      | 当作为列表提供时选取一个，默认 `solid`      |
| `${name}ColorFillStops` | 范围（最小 2）                          | `${name}ColorFillStops` | 渐变停靠点数量；当填充为 `solid` 时忽略，默认 `2` |
| `${name}ColorAngle`     | 范围 -360…360                         | `${name}ColorAngle`     | 渐变旋转角度，默认 `0`                     |

每个组的解析规则：

1. 从用户选项（`${name}Color`）中获取候选颜色，或回退到样式定义的调色板
2. 将所有颜色标准化为十六进制
3. 确定停靠点数量：如果填充为 `solid` 则为 `1`，否则采样 `${name}ColorFillStops`（PRNG `integer`，默认 `2`）
4. 应用样式定义中的约束：
   - **`contrastTo`**：按与引用颜色的 WCAG 2.1 对比度比值（降序）对候选项排序——不要洗牌
   - **`notEqualTo`**：过滤掉已为被引用组选中的颜色
5. 如果没有 `contrastTo` 约束：对候选项洗牌
6. 截取到停靠点数量

#### WCAG 2.1 对比度

对比度排序是不同语言实现之间最容易出现细微一致性偏移的来源——线性化截止值或亮度系数的微小差异会改变某些调色板上的排序。请严格使用以下公式：

```
function linearize(channel: uint8) -> float:
    s = channel / 255
    if s <= 0.04045:
        return s / 12.92
    return ((s + 0.055) / 1.055) ^ 2.4

function luminance(hex: string) -> float:
    (r, g, b) = parseHex(hex)
    return 0.2126 * linearize(r)
         + 0.7152 * linearize(g)
         + 0.0722 * linearize(b)

function contrastRatio(a: hex, b: hex) -> float:
    la = luminance(a)
    lb = luminance(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)
```

截止值是 `0.04045`，指数是 `2.4`，R/G/B 的系数分别是
`0.2126 / 0.7152 / 0.0722`。排序按 `contrastRatio(candidate, refColor)` 降序进行。

## SVG 渲染流水线

渲染器遍历元素树并生成一个 SVG 字符串。转换会按特定顺序应用——顺序错误会产生不同的输出。

### 1. 背景

如果设置了 `backgroundColor`，则将一个覆盖整个画布的 `<rect>` 作为第一个元素渲染。

### 2. 元素树

递归遍历 `canvas.elements` 数组：

- **`element`**: 以带属性的 SVG 标签形式渲染。解析属性值中的颜色引用和变量引用。
- **`text`**: 以转义后的文本内容渲染。解析变量引用。
- **`component`**: 查找所选变体（来自选项解析）。如果组件可见，则发出一个 `<use>` 元素，指向一个保存该变体主体的 `<defs>` 条目——见下文。

当某个 `element` 的名称为 `defs` 时，渲染器**不会**内联发出 `<defs>` 标签。相反，该元素的每个子元素都会被渲染，并推送到渲染器在整个遍历过程中累积的共享 `<defs>` 块中（连同生成的渐变、裁剪路径和组件变体主体一起）。这使得样式定义可以携带可复用片段，而不会破坏“每个文档仅一个 `<defs>`”的不变量。

#### 组件渲染

组件引用绝不会内联。渲染器第一次遇到某个 `(component, variant)` 对时，它会：

1. 渲染该变体的元素树。
2. 将其包装在 `<g id="{sourceName}-{variantName}-{seedHash}">…</g>` 中，并追加到共享的 `<defs>` 块。`sourceName` 是 *源* 组件名称——对于通过 `extends` 声明的别名来说，这是该别名指向的组件名称，因此引用同一源的每个别名都会共享一个 `<defs>` 条目。
3. 在调用位置发出 `<use transform="…" href="#{id}"/>`（当所有按组件变换都为恒等时会省略 transform——见 [按组件变换](#per-component-transforms-render-time)）。

`seedHash` 是 seed 的 FNV-1a 十六进制哈希，小写并左侧零填充至 8 个字符。

### 3. 变换顺序

主体（背景加上已渲染元素）会被包裹在嵌套的 `<g>` 元素中。下面的列表顺序为 **最外层 → 最内层** —— 圆角裁剪始终会发出，其余仅在其值非恒等时才会发出。

1. **边框圆角（始终）** — 在 `<defs>` 中注册一个 `<clipPath id="clip-{seedHash}">`，其中包含一个 `<rect width="{w}" height="{h}" rx="{rx}" ry="{ry}"/>`，这里 `rx = (borderRadius / 100) * canvas.width` 且 `ry = (borderRadius / 100) * canvas.height`。将主体包裹在 `<g clip-path="url(#clip-{seedHash})">` 中。**即使 `borderRadius` 为 `0`，此包裹也会发出**（此时 `rx="0" ry="0"`），以确保被变换的内容不会溢出画布边界。
2. **平移**（若二者均为 `0` 则跳过）— `<g transform="translate(dx, dy)">`，其中 `dx = (translateX / 100) * canvas.width` 且 `dy = (translateY / 100) * canvas.height`。
3. **旋转**（若为 `0` 则跳过）— 围绕画布中心的 `<g transform="rotate(angle, cx, cy)">`，`cx = width / 2`，`cy = height / 2`。
4. **翻转**（若为 `none` 则跳过）— 取决于模式：
   - `horizontal`: `translate(width, 0) scale(-1, 1)`
   - `vertical`: `translate(0, height) scale(1, -1)`
   - `both`: `translate(width, height) scale(-1, -1)`
5. **缩放**（若为 `1` 则跳过）— `<g transform="translate(cx, cy) scale(s) translate(-cx, -cy)">`
   其中 `cx = width / 2`，`cy = height / 2`。

由于边框圆角始终包裹主体，渲染后的 SVG 总会包含一个 `<defs>` 块，并且至少有一条 `<clipPath>` 条目。

### 4. SVG 根元素

根 `<svg>` 元素的属性，按此顺序：

1. `xmlns="http://www.w3.org/2000/svg"`
2. `viewBox="0 0 {width} {height}"`
3. 来自样式定义的全局 `attributes`（每个都通过 `Xml.escape` 转义）
4. 要么是 `role="img" aria-label="{title}"`（当设置了 `title` 时，且已转义），要么是 `aria-hidden="true"`
5. `width="{size}"` 和 `height="{size}"`（仅在设置了 `size` 选项时）

其子元素，按这个精确顺序：

1. `<metadata>` — 来自 `meta` 的 Dublin Core / RDF 块（见下文）；如果 `meta` 为空，则整个省略。
2. `<defs>` — 累积的定义（裁剪路径、渐变、组件变体主体）。实际上总是存在，因为边框圆角裁剪总会被注册。
3. `<title>` — 仅在设置了 `title` 选项时。内容会被转义。
4. 来自上一步的变换后主体。

#### `<metadata>` 块

许可证/署名元数据会作为真实的 `<metadata>` 元素发出，并使用 RDF / Dublin Core 术语——**不是**作为 HTML 注释：

```xml
<metadata xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:dc="http://purl.org/dc/elements/1.1/"
          xmlns:dcterms="http://purl.org/dc/terms/">
  <rdf:RDF>
    <rdf:Description>
      <dc:title>{source.name}</dc:title>
      <dc:creator>{creator.name}</dc:creator>
      <dc:source xsi:type="dcterms:URI">{source.url}</dc:source>
      <dcterms:license xsi:type="dcterms:URI">{license.url}</dcterms:license>
      <dc:rights>{署名文本}</dc:rights>
    </rdf:Description>
  </rdf:RDF>
</metadata>
```

每个 `dc:*` / `dcterms:*` 字段仅在对应的 `meta` 字段有值时才会包含；如果没有任何字段有值，则整个 `<metadata>` 元素会被省略。所有文本内容都会进行 XML 转义。`<dc:rights>` 的值是一个单行署名字符串，由 `source`、`creator` 和 `license` 组成（除非样式采用 MIT 许可证、由 DiceBear 自身编写，或者没有 `source.name`，否则前面会加上 `Remix of `）。

### 5. ID 随机化

当 `idRandomization` 为 `true` 时，会在每个现有的 `id` 属性后追加一个随机后缀，并更新每个匹配的引用。替换模式包括 `id="…"`, `url(#…)` 和 `href="#…"`——每次出现都会被重写为 `{original}-{suffix}`。

后缀格式为 **6 个小写十六进制字符**，左侧用零填充：在 JavaScript 中是 `Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')`。

该后缀**必须是非确定性的**：它应当来自宿主语言的非种子 RNG（JavaScript 中的 `Math.random()`，PHP 中的 `random_int()`），而不是来自 DiceBear PRNG。否则，使用相同种子渲染的两个头像仍会在 ID 上冲突，从而破坏该特性的目的。由于随机化输出是非确定性的，它被排除在一致性测试之外——头像 fixtures 使用默认的 `idRandomization: false`。

## 渐变渲染

当一个颜色组有多个 stop（fill 为 `linear` 或 `radial`）时：

1. 在 `<defs>` 中创建一个 `<linearGradient>` 或 `<radialGradient>`
2. 计算 stop 偏移：`round(i / (count - 1) * 100)%`
3. 通过 `gradientTransform="rotate(angle, 0.5, 0.5)"` 应用渐变旋转
4. 在 fill 属性中通过 `url(#gradient-id)` 引用
5. 渐变 ID 格式：`{colorName}-color-{seedHash}`，其中 `seedHash` 是 seed 的 FNV-1a 十六进制哈希（8 个字符，左侧零填充）

## 首字母提取

`initial` 和 `initials` 变量从 seed 派生：

1. 去除 `@...` 后缀（用于电子邮件地址）
2. 移除类撇号字符（`` ` ´ ' ʼ ``）
3. 匹配 Unicode 字母序列（`\p{L}[\p{L}\p{M}]*`）
4. 如果只有一个单词：取前 1-2 个字符（保留组合音标）
5. 如果有多个单词：取第一个和最后一个单词的首字母
6. 转换为大写

## 测试你的实现

DiceBear 仓库提供了一套语言无关的一致性测试套件，位于 [`tests/fixtures/parity/`](https://github.com/dicebear/dicebear/tree/10.x/tests/fixtures/parity)。  
这是验证新实现的标准方式：JavaScript 和 PHP 的参考实现都会消费同一组 JSON fixtures 并断言相同的输出，因此任何读取这些 fixtures 的移植实现都能免费获得相同的覆盖范围。

fixture 树包含：

- **`fnv1a.json`** — 输入字符串及其期望的 32 位哈希和 8 字符十六进制表示。包含 ASCII、由 `Prng.getValue()` 生成的 `seed:key` 模式，以及 Unicode（`„é"`、`„日本語"`、emoji、长字符串）。
- **`mulberry32.json`** — 种子及其前 5 组链式 `{nextFloat, state}` 对。用于捕获状态推进 bug，而不仅仅是第一步 bug。
- **`prng.json`** — 每个 `Prng` 方法（`getValue`、`pick`、`weightedPick`、`bool`、`float`、`integer`、`shuffle`）的 `{seed, key, args, result}` 测试用例，包括 `pick` / `weightedPick` / `shuffle` 的顺序无关性检查。
- **`styles/{initials,thumbs,glass,notionists}.json`** — 四个样式定义的 vendored 副本，选择它们是为了覆盖大多数渲染特性（文本、组件、颜色覆盖、渐变填充、根 SVG 属性）。
- **`avatars/{initials,thumbs,glass,notionists}.json`** — 每种样式对应的 `{id, options, svg, resolvedOptions}` 用例，涵盖 seed、size、scale、rotate、translate、border radius、flip、背景渐变（solid/linear/radial）、组件变体覆盖，以及诸如 `fontFamily` 和 `gestureVariant` 之类的样式特定选项。

### 如何使用这些 fixtures

对于每个 fixture 条目，你的实现必须精确产生记录的结果：

```text
fnv1a:      Fnv1a::hash(input)        == entry.hash
            Fnv1a::hex(input)         == entry.hex
mulberry32: m = Mulberry32(seed);
            for each {float, state} in sequence:
              m.nextFloat() == float && m.state() == state
prng:       Prng(seed).<method>(key, args) == result
avatar:     Avatar(style, options).toString() == svg   (逐字节一致)
```

先从 `fnv1a.json` 和 `mulberry32.json` 开始——这些是纯函数，也最容易调试。它们通过之后，`prng.json` 用例会告诉你排序顺序、weighted-pick 阈值和 Fisher–Yates 循环是否匹配。只有在那之后再转向 avatar fixtures，因为它们组合了所有内容。

每个 avatar fixture 上的 `resolvedOptions` 字段只包含在解析过程中实际被触及的选项——未设置的选项（`title`、未提供时的 `size` 等）不会出现。JavaScript 参考实现依赖 `JSON.stringify()` 在序列化边界丢弃 `undefined` 值；PHP 参考实现则在 `Options::resolved()` 中显式过滤 `null` 值。两者都会产生相同的形状。若某个移植实现原样返回完整的 memo map，则比较会失败——在序列化前请去除未设置的条目。

### 重新生成 fixtures

这些 fixtures 由 JavaScript 参考实现生成：

```bash
npm run fixtures:parity
```

这会从 `@dicebear/core` 重新写入 `tests/fixtures/parity/` 下的每个文件。只有在你有意更改了 JS 渲染输出，并希望为所有实现更新期望值时，才需要运行它。

### 手动 SVG 比较

除了 fixtures 之外，对于临时抽查，你还可以通过 CLI 生成参考 SVG，并逐字节比较：

```bash
dicebear initials ./reference --seed "Alice" --count 1
dicebear lorelei ./reference --seed "Alice" --count 1
dicebear avataaars ./reference --seed "Alice" --count 1
```

先从 `initials` 样式开始（最简单），再逐步过渡到具有多个组件和颜色约束的更复杂样式。

## 参考实现

| 语言       | 包              | 源码                                                                                   |
| ---------- | --------------- | ---------------------------------------------------------------------------------------- |
| JavaScript | `@dicebear/core`| [src/js/core/src/](https://github.com/dicebear/dicebear/tree/10.x/src/js/core/src)      |
| PHP        | `dicebear/core` | [src/php/core/src/](https://github.com/dicebear/dicebear/tree/10.x/src/php/core/src)    |
