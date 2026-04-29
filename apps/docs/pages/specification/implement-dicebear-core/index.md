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

### Seed

如果未提供，seed 默认为 `''`（空字符串）。

### 核心选项

| 选项               | PRNG key          | 解析方式                                       |
| ------------------ | ----------------- | -------------------------------------------- |
| `flip`             | `flip`             | 从 `['none', 'horizontal', 'vertical', 'both']` 中 `pick` |
| `rotate`           | `rotate`          | 从范围内 `float`，默认 `0`              |
| `scale`            | `scale`           | 从范围内 `float`，默认 `1`              |
| `borderRadius`     | `borderRadius`     | 从范围内 `float`，默认 `0`              |
| `translateX`       | `translateX`      | 从范围内 `float`，默认 `0`              |
| `translateY`       | `translateY`      | 从范围内 `float`，默认 `0`              |
| `fontFamily`       | `fontFamily`      | 从数组中 `pick`，默认 `'system-ui'`     |
| `fontWeight`       | `fontWeight`      | 从数组中 `pick`，默认 `400`             |

### 组件选项

对于每个组件（例如 `eyes`）：

| 选项                | PRNG key              | 解析方式                               |
| ------------------- | --------------------- | -------------------------------------- |
| `eyesProbability`   | `eyesProbability`     | 带概率的 `bool`，默认 `100`    |
| `eyesVariant`       | `eyesVariant`         | 从变体中 `weightedPick`             |
| `eyesRotate`        | `eyesRotate`          | 从范围或组件默认值中 `float`  |
| `eyesTranslateX`    | `eyesTranslateX`      | 从范围或组件默认值中 `float`  |
| `eyesTranslateY`    | `eyesTranslateY`      | 从范围或组件默认值中 `float`  |
| `eyesScale`         | `eyesScale`           | 从范围或组件默认值中 `float`，默认 `1` |

如果概率检查失败，则组件不会被渲染（variant 返回 `undefined`）。

### 颜色选项

对于每个颜色组（例如 `skin`）：

1. 从用户选项（`skinColor`）或样式定义中获取候选颜色
2. 将所有颜色标准化为十六进制
3. 确定 stop 数量：如果 fill 是 `solid`，则为 `1`，否则取自
   `skinColorFillStops`（PRNG 整数，默认 `2`）
4. 应用样式定义中的约束：
   - **`contrastTo`**：按相对于引用颜色的 WCAG 2.1 对比度（降序）对候选项排序——不要洗牌
   - **`notEqualTo`**：过滤掉已为引用组选择的颜色
5. 如果没有 `contrastTo` 约束：洗牌候选项
6. 截取到 stop 数量

颜色选择所使用的 PRNG key 是 `{name}Color`（例如 `skinColor`）。

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

- **`element`**：作为带属性的 SVG 标签渲染。解析属性值中的颜色引用和变量引用。
- **`text`**：作为转义后的文本内容渲染。解析变量引用。
- **`component`**：查找所选变体（来自选项解析）。如果组件可见，则渲染该变体的元素。将组件特定的变换（translate、rotate）作为包裹的 `<g>` 元素应用。

有一个特殊情况：当 `element` 的名称是 `defs` 时，渲染器**不会**内联输出 `<defs>` 标签。相反，该元素的每个子元素都会被渲染并推入渲染器在整个遍历过程中累积的共享 `<defs>` 块中（以及生成的渐变和裁剪路径）。这使得样式定义可以提供可复用片段，而不会破坏每个文档只包含一个 `<defs>` 的不变式。

### 3. 变换顺序

按以下顺序将渲染后的主体包裹在嵌套的 `<g>` 元素中（最外层优先）：

1. **圆角半径** — 使用圆角矩形的裁剪路径
2. **平移** — `translate(dx, dy)`，其中
   `dx = (translateX / 100) * canvas.width`,
   `dy = (translateY / 100) * canvas.height`
3. **旋转** — 围绕画布中心的 `rotate(angle, cx, cy)`
4. **翻转** — 取决于模式：
   - `none`：无变换
   - `horizontal`：`translate(width, 0) scale(-1, 1)`
   - `vertical`：`translate(0, height) scale(1, -1)`
   - `both`：`translate(width, height) scale(-1, -1)`
5. **缩放** — `translate(cx, cy) scale(s) translate(-cx, -cy)`，其中
   `cx = width / 2`，`cy = height / 2`

### 4. SVG 根元素

根 `<svg>` 元素包含：

- `xmlns="http://www.w3.org/2000/svg"`
- `viewBox="0 0 {width} {height}"`
- `width` 和 `height` 属性（如果设置了 `size` 选项）
- 来自样式定义的全局 `attributes`
- 如果设置了 `title`，则包含 `role="img"` 和 `aria-label="{title}"`
- 如果未设置 `title`，则包含 `aria-hidden="true"`

如果设置了 `title`，请将 `<title>` 元素作为第一个子元素包含进来。

将任何 `<defs>`（渐变、裁剪路径）放在 title 之后。

在主体内容之前包含来自 `meta` 的许可证注释。

### 5. ID 随机化

当 `idRandomization` 为 `true` 时，为所有 `id` 属性追加一个随机后缀，并更新所有引用（`url(#...)`、`href="#..."`）。这可以防止在同一 HTML 文档中嵌入多个头像时发生 ID 冲突。

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
