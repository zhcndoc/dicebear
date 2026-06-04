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
没有原生 UTF-16 字符串的语言必须先转换——在基本多文种平面之外（例如表情符号），代码单元和码点会发生分歧，而使用
码点会导致这些输入的哈希错误。PHP 参考实现显式进行了转换：

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

- `| 0` 强制转换为 32 位有符号整数（处理溢出）
- `>>> 0` 再转换回无符号 32 位
- `Math.imul` 执行 32 位整数乘法
- `nextFloat()` 通过除以 `2^32` 返回 `[0, 1)` 范围内的值
- 状态是 **有状态的** —— 每次调用 `next()` 时都会推进
- 对于拥有 64 位整数但没有原生 `uint32_t` 的语言（例如 PHP、Lua），必须手动实现 32 位乘法：朴素的 `uint32 * uint32` 会超过
  `2^63 - 1` 并静默溢出。PHP 参考实现将一个操作数拆成
  16 位半字；请参见
  [`Prng/Mulberry32.php::mul`](https://github.com/dicebear/dicebear/blob/10.x/src/php/core/src/Prng/Mulberry32.php)。

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

对于输入中有多个条目的情况，每种选择方法都会先进行标准化：

1. 按项目的字符串表示进行 **去重**，保留第一次出现的项
   （仅 `pick` 和 `shuffle` —— `weightedPick` 作用于 map，并且按构造天然具有唯一键）。
2. 按项目的字符串表示进行 **排序**，使用 UTF-16 代码单元
   比较（JavaScript 默认的 `.sort()` 顺序）。

空输入返回 `undefined`（`shuffle` 则返回空数组）；单条目输入会原样返回，不进行去重或排序。两步标准化使多条目输出不受调用者顺序和重复项影响。实际上，唯一会被排序的值是组件变体名称和十六进制颜色字符串——二者都保证是 ASCII——因此实现可以使用 `strcmp` 并保持结果一致，即使 JavaScript 参考实现比较的是完整 UTF-16 代码单元。PHP 参考实现正是如此。

#### `pick(key, items) -> item | undefined`

从数组中选择一个项目。

```
function pick(seed, key, items):
    if items is empty: return undefined
    if items has 1 item: return items[0]
    unique = deduplicate items by string representation
    if unique has 1 item: return unique[0]
    sorted = sort unique by string representation
    index = floor(getValue(seed, key) * length(sorted))
    return sorted[index]
```

#### `weightedPick(key, weights) -> key | undefined`

接受一个 `string → weight` 的 map，并返回其中一个键，按权重偏向选择。当所有权重都为 `0` 时，会退回到对这些键进行无权重的 `pick`。

```
function weightedPick(seed, key, weights):
    keys = keys of weights
    if keys is empty: return undefined
    if keys has 1 item: return keys[0]
    sorted = sort keys by string representation
    totalWeight = sum of weights[k] for k in sorted
    if totalWeight == 0: return pick(seed, key, sorted)
    threshold = getValue(seed, key) * totalWeight
    cumulative = 0
    for each k in sorted:
        cumulative += weights[k]
        if threshold < cumulative: return k
    return last(sorted)
```

#### `bool(key, likelihood) -> boolean`

以 `likelihood / 100` 的概率返回 `true`。`likelihood` 默认值为
`50`。

```
function bool(seed, key, likelihood = 50):
    return getValue(seed, key) * 100 < likelihood
```

#### `float(key, range) -> number`

返回闭区间内的浮点数，四舍五入到小数点后四位。`range` 是模式里的 `{ min, max, step? }` 对象。如果 `min > max`，则内部交换它们。若 `step > 0`，则从
`{ min + i × step | 0 ≤ i ≤ ⌊(max − min) / step⌋ }` 中均匀采样——因此当 `(max − min)`
不是 `step` 的整数倍时，最后一个桶会 `≤ max`，而 `max` 本身只有在整除时才会被命中。不带 `step` 时，范围是连续的。

```
function float(seed, key, range):
    min = min(range.min, range.max)
    max = max(range.min, range.max)
    step = range.step if range.step > 0 else 0

    if step > 0:
        buckets = floor((max - min) / step) + 1
        i = floor(getValue(seed, key) * buckets)
        raw = min + i * step
    else:
        raw = min + getValue(seed, key) * (max - min)

    return round(raw * 10000) / 10000   # 四舍五入，.5 进位到 +Infinity
```

这里的 `round` 与 [number formatting](#number-formatting) 中相同：
.5 会朝 **+Infinity** 方向舍入（JavaScript 的 `Math.round`），而不是你所用语言的原生舍入。PHP 的 `round()` 和许多其他实现会把 .5
**远离零** 舍入，这在负值正好落在 `.5` 边界时会产生差异（例如 `round(-0.40625 × 10000) / 10000` 是 `-0.4062`，不是 `-0.4063`）。

#### `integer(key, range) -> number`

返回闭区间内的整数，两端都包含。接受与 `float` 相同的
`{ min, max, step? }` 对象；`step` 为保持对称性而接受，但会被忽略——整数本来就是按 1 递增的。

```
function integer(seed, key, range):
    min = min(range.min, range.max)
    max = max(range.min, range.max)
    return floor(getValue(seed, key) * (max - min + 1)) + min
```

#### `shuffle(key, items) -> items[]`

使用一个 **有状态** 的 Mulberry32 实例（不是基于 key 的）进行 Fisher-Yates 洗牌。对于长度 ≤ 1 的输入，项目会在不去重的情况下以副本形式返回。

```
function shuffle(seed, key, items):
    if length(items) <= 1: return copy of items
    unique  = deduplicate items by string representation
    sorted  = sort unique by string representation
    result  = copy of sorted
    prng    = new Mulberry32(fnv1a_hash(seed + ":" + key))

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

| Option            | PRNG key       | Resolution                                                                 |
| ----------------- | -------------- | -------------------------------------------------------------------------- |
| `seed`            | —              | 字面字符串；如果未提供，默认为 `''`。不缓存。            |
| `size`            | —              | 字面数字；默认未设置（渲染器省略 `width`/`height`）。       |
| `idRandomization` | —              | 布尔值；默认 `false`。使用宿主 RNG，而不是 DiceBear PRNG。        |
| `title`           | —              | 字面字符串；默认未设置（省略 `<title>`，使用 `aria-hidden`）。   |
| `flip`            | `flip`         | 从 `['none', 'horizontal', 'vertical', 'both']` 中 `pick`，默认 `'none'` |
| `rotate`          | `rotate`       | 范围内的 `float`，默认 `0`                                            |
| `scale`           | `scale`        | 范围内的 `float`，默认 `1`                                            |
| `borderRadius`    | `borderRadius` | 范围内的 `float`，默认 `0`                                            |
| `translateX`      | `translateX`   | 范围内的 `float`，默认 `0`                                            |
| `translateY`      | `translateY`   | 范围内的 `float`，默认 `0`                                            |
| `fontFamily`      | `fontFamily`   | 从数组中 `pick`，默认 `'system-ui'`                                   |
| `fontWeight`      | `fontWeight`   | 从数组中 `pick`，默认 `400`                                           |

没有 PRNG key 的选项会直接从用户输入中读取。其余选项会在给定 key 下从用户提供的范围/列表中采样，
并在未提供时回退到列出的默认值。

The range options (`rotate`, `scale`, `borderRadius`, `translateX`,
`translateY`, and the per-color `${name}ColorAngle` / `${name}ColorFillStops`)
accept a number or an array, normalized to a `{ min, max }` range before
`float`/`integer` sampling:

- a bare number `n` → `{ min: n, max: n }` (a fixed value);
- a single-element array `[n]` → `{ min: n, max: n }` (same as the bare number);
- a two-element array → `{ min, max }` taken as the smaller/larger of the two
  (order does not matter — sampling swaps them anyway);
- an empty array `[]`, or the option unset, → fall back to the listed default.

Note the edge cases: `[n]` is a fixed value (**not** the default), and `[]`
falls back to the default (**not** a range with a missing bound). A fixed range
where `min === max` always samples that exact value.

### Component options

对于每个组件（例如 `eyes`），用户可以提供恰好两个选项：

| Option            | PRNG key          | Resolution                                                                                                     |
| ----------------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `eyesProbability` | `eyesProbability` | `bool` with likelihood from the user option, falling back to the component's `probability` (or `100` if unset) |
| `eyesVariant`     | `eyesVariant`     | `weightedPick` over a weighted map (see below)                                                                 |

If the probability check fails, the component is not rendered and `variant`
returns `undefined`.

`eyesVariant` accepts three shapes from the user: a single variant name, an
array of names, or a `Record<string, number>` weight map. Normalize the first
two to a map where each named variant has weight `1`. Then drop any keys that
are not declared in the component's `variants` block, and feed the remaining map
to `weightedPick`. When the user did not supply the option, build the map from
the variants' own `weight` values (defaulting to `1`).

For **component aliases** (declared via `extends` in the definition), the user
side is shared and only the PRNG side is independent. An alias does not expose
its own `${aliasName}Probability` or `${aliasName}Variant` user option — both
are read from the source component's `${sourceName}Probability` and
`${sourceName}Variant`. The PRNG, however, uses the alias's own name as the key
(`${aliasName}Probability`, `${aliasName}Variant`), so each alias rolls its
visibility and variant independently while still being constrained by the same
user-set weights.

### 每个组件的变换（渲染时）

每个组件引用在渲染时还会应用旋转、两个平移和缩放。这些 **不是用户选项**——它们会在每次渲染时根据组件定义中的 `rotate`/`translate`/`scale` 范围采样。它们会出现在内省用的 `resolvedOptions` 快照中的 `${name}Rotate` /
`${name}TranslateX` / `${name}TranslateY` / `${name}Scale` 下，但它们不是
面向用户的 `StyleOptions<D>` 类型的一部分，也不支持把它们再传回一个新的
`Avatar`。

| Value      | PRNG key         | Sampling                                          |
| ---------- | ---------------- | ------------------------------------------------- |
| rotate     | `eyesRotate`     | 来自 `component.rotate` 的 `float`，默认 `0`      |
| translateX | `eyesTranslateX` | 来自 `component.translate.x` 的 `float`，默认 `0` |
| translateY | `eyesTranslateY` | 来自 `component.translate.y` 的 `float`，默认 `0` |
| scale      | `eyesScale`      | 来自 `component.scale` 的 `float`，默认 `1`       |

平移值是 **组件自身** 的 `width` 和 `height` 的百分比（不是头像画布）；将其乘以组件尺寸即可得到偏移量。与输出的每个数字一样，它随后会经过
[`formatNumber`](#number-formatting) 处理（将其最多保留到小数点后 5 位）。旋转和缩放的变换中心 `(cx, cy)` 是组件自身中心——
`(width / 2, height / 2)`。

在生成的 SVG 中，非恒等值会以空格分隔后连接成一个单独的 `transform` 属性，写在 `<use>` 元素上，顺序如下（从左到右读取）：

```
transform="translate(tx, ty) rotate(angle, cx, cy) translate(cx, cy) scale(s) translate(-cx, -cy)"
```

规则：

- Translate 是一个片段——当 `tx ≠ 0` 或 `ty ≠ 0` 时输出。
- Rotate 是一个片段——当 `angle ≠ 0` 时输出。
- Scale 是三部分的 `translate cx,cy / scale s / translate -cx,-cy`
  片段——当 `s ≠ 1` 时作为一个整体输出。
- 如果 `(tx, ty, angle, s)` 全都为恒等值，则完全省略 `transform` 属性。
- 如果样式作者在组件引用上写了 `transform`，它会原样前置于这些片段之前（见
  [Component rendering](#component-rendering)）。

### 颜色选项

对于定义中声明的每个颜色组——**加上**一个隐式的
`background` 组——用户可以提供四个选项：

| Option                  | Type                                     | PRNG key                | Notes                                                                             |
| ----------------------- | ---------------------------------------- | ----------------------- | --------------------------------------------------------------------------------- |
| `${name}Color`          | hex string or list                       | `${name}Color`          | 候选颜色（覆盖定义中的调色板）；通过 `Color.toHex` 归一化 |
| `${name}ColorFill`      | enum `solid` / `linear` / `radial`       | `${name}ColorFill`      | 对列表进行 `pick`，默认 `'solid'`                                             |
| `${name}ColorFillStops` | integer ≥ 2, or `[min, max]` of same     | `${name}ColorFillStops` | `integer` 采样，默认 `2`；当 fill 为 `solid` 时忽略                       |
| `${name}ColorAngle`     | number in `[-360, 360]`, or `[min, max]` | `${name}ColorAngle`     | `float` 采样，默认 `0`                                                       |

每个组的解析规则：

1. 从用户选项（`${name}Color`）获取候选颜色，或回退到样式定义的调色板。
2. 将每个候选项归一化为小写十六进制（6 或 8 位，前导 `#`）。
   3/4 位简写会展开为 6/8 位。
3. 确定 stop 的数量：如果 fill 是 `solid` 则为 `1`，否则采样
   `${name}ColorFillStops`（PRNG `integer`，默认 `2`）。
4. 应用样式定义中的约束：
   - **`contrastTo`**：根据相对于引用颜色的 WCAG 2.1 对比度比值对候选项排序
     （降序）。引用颜色通过递归调用 color-resolver 解析，因此必须检测并拒绝循环。
   - **`notEqualTo`**：从每个候选颜色以及引用组中所有已选颜色中去掉 alpha 通道，然后删除匹配项。如果过滤会导致候选列表为空，则回退到未过滤列表——颜色约束只是尽力而为，不是硬约束。
5. 如果没有 `contrastTo` 约束，则对候选项进行洗牌。
6. 截取到 stop 数量。

对于在样式定义中未声明颜色条目的组——最常见的是隐式的
`background` 组——会完全跳过约束处理，只对用户提供的候选项进行洗牌。

#### WCAG 2.1 对比度

对比度排序是各语言实现之间最容易出现细微偏差的地方之一——线性化阈值或亮度系数的微小差异都会改变某些调色板的排序。请严格使用以下公式：

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

阈值是 `0.04045`，指数是 `2.4`，R/G/B 的系数分别是
`0.2126 / 0.7152 / 0.0722`。排序按 `contrastRatio(candidate, refColor)` 的降序进行。

## SVG 渲染流水线

渲染器会遍历元素树并生成一个 SVG 字符串。转换会按特定顺序应用——顺序弄错会产生不同的输出。

### 数字格式化

所有输出到 SVG 的数字——`viewBox` 尺寸、`width`/`height`、`translate`/`rotate`/`scale` 的偏移及其中心点、`rx`/`ry`、渐变停止点偏移、`fontWeight` 变量等等——都必须通过同一个辅助函数转成字符串，这样所有实现才能产生字节级一致的输出：

```
function formatNumber(value):
    scaled = round(value * 100000)   # 四舍五入时，半数向 +Infinity 方向取整
    sign = "-" if scaled < 0 else ""
    scaled = abs(scaled)

    integer  = floor(scaled / 100000)
    fraction = (scaled mod 100000), padded to 5 digits, then trailing zeros removed

    if fraction is empty:
        return sign + integer
    return sign + integer + "." + fraction
```

这会最多保留 **5 位小数**，并且始终使用普通十进制表示——绝不使用科学计数法/指数表示法——且不会有尾随零，也不会有尾随的 `.0`（例如 `1`、`-50`、`2.5`、`0.00001`）。字符串必须基于整数 `scaled` 来构建，而不是依赖语言自身的浮点转字符串：PHP 基于精度的强制转换和 Python 的 `repr` 在小数、大数或分数值上都与 JavaScript 不一致。`round` 这一步采用的是半数向 +Infinity 方向取整（JavaScript 的 `Math.round`）；请精确模拟它——`floor(x + 0.5)` **并不**等价（对于小于 `0.5` 的最大双精度浮点数，它会返回 `1` 而不是 `0`）。

### 1. 背景

渲染器会无条件向解析器请求 `background` 颜色组——每种样式都隐式包含它，即使样式定义中没有声明 `background` 组。如果解析后的列表非空，则将 `<rect width="{w}" height="{h}" fill="{fill}"/>` 作为第一个主体元素输出。`{fill}` 要么是字面量十六进制字符串（纯色填充，或单一候选颜色），要么是指向注册在 `<defs>` 中的渐变的 `url(#…)` 引用——参见 [渐变渲染](#渐变渲染)。

### 2. 元素树

递归遍历 `canvas.elements` 数组：

- **`element`**：当没有子元素时，渲染为 `<{name} {attrs}/>`（自闭合）；否则渲染为 `<{name} {attrs}>{children}</{name}>`。先解析属性值中的颜色和变量引用，再对解析结果进行 XML 转义。元素名和属性键按字面值写出，因为 schema 验证器已经将它们限制在安全白名单内。
- **`text`**：解析任何变量引用，然后对结果进行 XML 转义，并将其作为父元素的文本内容输出。
- **`component`**：查找所选变体（来自选项解析）。如果该组件可见，则输出一个 `<use>` 元素，指向 `<defs>` 中保存该变体主体的条目——见下文。

当 `element` 的名称为 `defs` 时，渲染器**不会**在内联位置输出 `<defs>` 标签。相反，它会渲染每个子元素，并将其推入渲染器在整个遍历过程中累积的共享 `<defs>` 块中（同时还会加入生成的渐变、裁剪路径和组件变体主体）。映射键在有 `id` 属性时使用子元素的 `id`，否则使用合成的 `_{n}` 槽位——因此两个具有相同 `id` 的子元素会折叠为同一条目，最后写入者获胜。这使得样式定义能够提供可复用片段，而不会破坏“每个文档只允许一个 `<defs>`”的不变量。

#### 组件渲染

组件引用从不内联。渲染器第一次遇到某个 `(component, variant)` 对时，会：

1. 渲染该变体的元素树。
2. 将其包裹在 `<g id="{sourceName}-{variantName}-{seedHash}">…</g>` 中，并追加到共享 `<defs>` 块。`sourceName` 是 _源_ 组件名称——对于通过 `extends` 声明的别名，这是别名所指向的组件名称，因此所有引用同一源的别名会共享一个 `<defs>` 条目。
3. 在调用处输出 `<use {attributes} href="#{id}"/>`，其中 `{attributes}` 包含：
   - 样式作者写在组件引用本身上的每个属性（按迭代顺序先输出）。
   - 一个由组件级变换组成的 `transform` 属性（见 [组件级变换（渲染时）](#组件级变换渲染时)）。如果作者也提供了 `transform`，则会将其**前置**，使其作为最外层（定位）变换，组件级值在其内部应用。如果所有组件级值都是 identity 且作者未提供 `transform`，则整个属性会被省略。

`seedHash` 是 seed 的 FNV-1a 十六进制哈希，使用小写并左侧零填充到 8 个字符。

### 3. 变换顺序

主体（背景加已渲染元素）会被包裹在嵌套的 `<g>` 元素中。下面的列表按**最外层 → 最内层**排列——边框圆角裁剪总会输出，其余项仅在其值非 identity 时输出。

1. **边框圆角（始终）** — 在 `<defs>` 中注册一个 `<clipPath id="clip-{seedHash}">`，其中包含一个 `<rect width="{w}" height="{h}" rx="{rx}" ry="{ry}"/>`，这里 `rx = (borderRadius / 100) * canvas.width`，`ry = (borderRadius / 100) * canvas.height`。将主体包裹在 `<g clip-path="url(#clip-{seedHash})">` 中。**即使 `borderRadius` 为 `0`，也会输出这个包裹层**（此时 `rx="0" ry="0"`），以确保经过变换的内容不会溢出画布边界。
2. **平移**（如果两个值都为 `0` 则跳过）— `<g transform="translate(dx, dy)">`，其中 `dx = (translateX / 100) * canvas.width`，`dy = (translateY / 100) * canvas.height`。
3. **旋转**（如果为 `0` 则跳过）— 围绕画布中心的 `<g transform="rotate(angle, cx, cy)">`，`cx = width / 2`，`cy = height / 2`。
4. **翻转**（如果为 `none` 则跳过）— 取决于模式：
   - `horizontal`：`translate(width, 0) scale(-1, 1)`
   - `vertical`：`translate(0, height) scale(1, -1)`
   - `both`：`translate(width, height) scale(-1, -1)`
5. **缩放**（如果为 `1` 则跳过）—
   `<g transform="translate(cx, cy) scale(s) translate(-cx, -cy)">`，其中 `cx = width / 2`，`cy = height / 2`。

由于边框圆角始终包裹主体，渲染后的 SVG 总会包含一个 `<defs>` 块，并且至少有一条 `<clipPath>` 条目。

### 4. SVG 根元素

根 `<svg>` 元素的属性，按此顺序：

1. `xmlns="http://www.w3.org/2000/svg"`
2. `viewBox="0 0 {width} {height}"`
3. 来自样式定义的全局 `attributes`——键按白名单原样写出，值进行 XML 转义
4. 要么是 `role="img" aria-label="{title}"`（当设置了 `title` 时，内容会被转义），要么是 `aria-hidden="true"`
5. `width="{size}"` 和 `height="{size}"`（仅在设置了 `size` 选项时）

其子元素按这个精确顺序排列：

1. `<metadata>` — 来自 `meta` 的 Dublin Core / RDF 块（见下文）；如果 `meta` 为空，则完全省略。
2. `<defs>` — 累积的定义（clip path、渐变、组件变体主体）。实际上总是存在，因为边框圆角裁剪总会注册。
3. `<title>` — 仅当设置了 `title` 选项时存在。内容会被转义。
4. 上一步得到的变换后主体。

#### `<metadata>` 块

许可证/署名元数据会作为真实的 `<metadata>` 元素输出，使用 RDF / Dublin Core 术语——**不是** HTML 注释：

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

每个 `dc:*` / `dcterms:*` 字段仅在对应的 `meta` 字段有值时才会包含；如果没有任何字段有值，则完全省略 `<metadata>` 元素。所有文本内容都会进行 XML 转义。`<dc:rights>` 的值是一个单行署名字符串，由 `source`、`creator` 和 `license` 组合而成（除非该样式是 MIT 许可证、由 DiceBear 自身编写，或者没有 `source.name`，否则前面会加上 `Remix of `）。

### 5. ID 随机化

当 `idRandomization` 为 `true` 时，会给每个现有的 `id` 属性追加一个随机后缀，并更新所有匹配引用。替换模式为 `id="…"`, `url(#…)` 和 `href="#…"` —— 每次出现都会被重写为 `{original}-{suffix}`。

后缀格式为 **6 个小写十六进制字符**，左侧零填充：在 JavaScript 中为
`Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')`。

后缀**必须是非确定性的**：应当来自宿主语言的非种子 RNG（JavaScript 中使用 `Math.random()`，PHP 中使用 `random_int()`），而不是 DiceBear 的 PRNG。否则即使两个头像使用相同 seed 渲染，它们的 ID 仍会冲突，从而破坏该功能的目的。由于随机化输出是非确定性的，它被排除在一致性测试之外——头像 fixtures 使用默认值 `idRandomization: false`。

## 渐变渲染

只有当填充为 `linear` 或 `radial`，并且颜色列表至少包含两个条目时，才会输出渐变。否则渲染器会返回一个字面量十六进制字符串（`colors[0]`，如果列表为空则返回 `'none'`）。

当需要渐变时：

1. 在 `<defs>` 中创建一个 `<linearGradient>`（用于 `linear`）或 `<radialGradient>`（用于 `radial`）。
2. 计算每个停止点的偏移：`formatNumber(i / (colors.length - 1) * 100)`，后接 `%`（偏移格式与其他数字一样——见 [数字格式化](#数字格式化)）。
3. 将每个颜色输出为 `<stop offset="{offset}%" stop-color="{hex}"/>`。
4. 仅当解析后的 `${name}ColorAngle` 非零时，才添加 `gradientTransform="rotate(angle, 0.5, 0.5)"`；否则完全省略该属性。
5. 在请求它的 fill 属性中通过 `url(#{id})` 引用该渐变。
6. 渐变 ID 格式：`{colorName}-color-{seedHash}`，其中 `seedHash` 是 seed 的 FNV-1a 十六进制哈希（8 个字符，左侧零填充，小写）。

## 首字母提取

`initial` 和 `initials` 变量通过 `Initials.fromSeed(seed)` 辅助函数从 seed 派生：

1. 去掉 `@...` 后缀，这样电子邮件只会得到一个名字（`alice@x` → `alice`，而不是 `[alice, x]`）。
2. 移除撇号类字符（`` ` ´ ' ʼ ``），这样 `O'Neill` 会被当作一个单词。
3. 使用 `\p{L}[\p{L}\p{M}]*` 匹配 Unicode 字母序列——每个匹配都是一个“单词”。
4. **没有找到单词？** 再试一次，但跳过第 1 步（这样仅为 `@bob` 的 seed 仍会得到 `B`）。如果仍然没有结果，则变量解析为空字符串。
5. **只有一个单词？** 取第一个或前两个类似字素的单位（`\p{L}\p{M}*`），并转为大写。
6. **多个单词？** 取第一个单词的第一个字素和最后一个单词的第一个字素，并转为大写。

`initial` 等于 `initials.charAt(0)`——也就是结果的第一个代码单元，对 regex 产生的每一种输入都与第一个字母一致。

## 测试你的实现

DiceBear 仓库提供了一套语言无关的一致性测试套件，位于 [`tests/fixtures/parity/`](https://github.com/dicebear/dicebear/tree/10.x/tests/fixtures/parity)。  
这是验证新实现的标准方式：JavaScript 和 PHP 的参考实现都会消费同一组 JSON fixtures 并断言相同的输出，因此任何读取这些 fixtures 的移植实现都能免费获得相同的覆盖范围。

fixture 树包含：

- **`fnv1a.json`** — 输入字符串及其对应的 32 位哈希和 8 字符十六进制表示。包括 ASCII、由 `Prng.getValue()` 生成的 `seed:key` 模式，以及 Unicode（`„é"`, `„日本語"`, emoji，长字符串）。
- **`mulberry32.json`** — 以种子开头，后面跟随前 5 组链式 `{nextFloat, state}` 对。用于捕获状态推进 bug，而不只是首步 bug。
- **`prng.json`** — 每个 `Prng` 方法（`getValue`、`pick`、`weightedPick`、`bool`、`float`、`integer`、`shuffle`）的 `{seed, key, args, result}` 测试用例，包括 `pick` / `weightedPick` / `shuffle` 的顺序无关性检查。
- **`styles/{initials,thumbs,glass,notionists}.json`** — 这四个样式定义的内置副本，旨在覆盖大多数渲染特性（文本、组件、颜色覆盖、渐变填充、根 SVG 属性）。
- **`avatars/{initials,thumbs,glass,notionists}.json`** — 每个样式对应的 `{id, options, svg, resolvedOptions}` 用例，覆盖 seed、size、scale、rotate、translate、border radius、flip、背景渐变（纯色/线性/径向）、组件变体覆盖，以及样式特定选项如 `fontFamily` 和 `gestureVariant`。

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

先从 `fnv1a.json` 和 `mulberry32.json` 开始——它们都是纯函数，也最容易调试。一旦这两项通过，`prng.json` 的用例就会告诉你排序顺序、weighted-pick 阈值以及 Fisher–Yates 循环是否匹配。之后再处理头像 fixtures，因为它们组合了所有内容。

每个头像 fixture 上的 `resolvedOptions` 字段只包含在解析过程中实际被访问到的选项——未设置的选项（如未提供时的 `title`、`size` 等）不会出现。JavaScript 参考实现依赖 `JSON.stringify()` 在序列化边界丢弃 `undefined` 值；PHP 参考实现则在 `Options::resolved()` 中显式过滤 `null` 值。两者产生相同的形状。若某个移植版本原样返回完整的 memo map，则比较会失败——在序列化前请删去未设置条目。

### 重新生成 fixtures

这些 fixtures 由 JavaScript 参考实现生成：

```bash
npm run fixtures:parity
```

这会从 `@dicebear/core` 重新写入 `tests/fixtures/parity/` 下的每个文件。只有在你有意更改了 JS 渲染输出，并希望为所有实现更新期望值时，才需要运行它。

### 手动 SVG 比较

对于除 fixtures 之外的临时抽查，你也可以从 CLI 生成参考 SVG，并逐字节比较：

```bash
dicebear initials ./reference --seed "Alice" --count 1
dicebear lorelei ./reference --seed "Alice" --count 1
dicebear avataaars ./reference --seed "Alice" --count 1
```

先从 `initials` 样式开始（最简单），再逐步过渡到具有多个组件和颜色约束的更复杂样式。

## 参考实现

| 语言        | 包              | 源码                                                                                 |
| ---------- | ------------------------------------------------------------------------------------ | ---------- |
| JavaScript | `@dicebear/core` | [src/js/core/src/](https://github.com/dicebear/dicebear/tree/10.x/src/js/core/src)   |
| PHP        | `dicebear/core`  | [src/php/core/src/](https://github.com/dicebear/dicebear/tree/10.x/src/php/core/src) |
