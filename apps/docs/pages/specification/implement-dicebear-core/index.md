---
title: Implement DiceBear Core | DiceBear
description: >
  Step-by-step guide for implementing DiceBear Core in any programming language.
  Covers the PRNG contract, options resolution, and SVG rendering pipeline.
---

# Implement DiceBear Core

This guide explains how to implement DiceBear Core in any programming language.
A correct implementation produces **byte-identical SVGs** to the
[JavaScript](https://github.com/dicebear/dicebear/tree/10.x/src/js/core) and
[PHP](https://github.com/dicebear/dicebear/tree/10.x/src/php/core) reference
implementations for the same seed and style definition.

## Architecture overview

```
Avatar(definition, options)
  │
  ├── Style        Parse and validate the definition JSON
  ├── Options      Resolve options using the PRNG
  └── Renderer     Generate SVG from resolved style + options
        │
        ├── Prng          Deterministic random number generator
        │   ├── Fnv1a     FNV-1a 32-bit hash
        │   └── Mulberry32  Stateful PRNG
        │
        └── SVG output
```

The core is intentionally minimal. It takes a
[style definition](/specification/definition-schema/) and user options, resolves
randomizable values through a deterministic PRNG, and renders an SVG string.

## PRNG contract

The PRNG is the interoperability surface. If your PRNG produces the same outputs
as the reference for the same inputs, your implementation will produce identical
SVGs. Get this right first.

### FNV-1a 32-bit hash

[FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function)
converts a string into a 32-bit unsigned integer. DiceBear iterates over
**UTF-16 code units** (not bytes, not code points).

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

In JavaScript, `input.charCodeAt(i)` returns UTF-16 code units directly.
Languages without native UTF-16 strings must convert first — outside the Basic
Multilingual Plane (e.g. emoji), code units and code points diverge, and using
code points instead produces wrong hashes for those inputs. The PHP reference
does the conversion explicitly:

```php
unpack('v*', mb_convert_encoding($input, 'UTF-16LE', 'UTF-8'))
```

Java and C# can iterate `string.charAt(i)` / `char` directly. For other
languages, transcode to UTF-16 and read 16-bit units.

**Reference (JS):**

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
is a stateful PRNG that converts a 32-bit seed into a sequence of pseudo-random
numbers. The implementation must match Tommy Ettinger's C reference exactly.

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

**Reference (JS):**

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

Key details:

- `| 0` forces 32-bit signed integer (handles overflow)
- `>>> 0` converts back to unsigned 32-bit
- `Math.imul` performs 32-bit integer multiplication
- `nextFloat()` returns a value in `[0, 1)` by dividing by `2^32`
- The state is **stateful** — it advances with each call to `next()`
- Languages with 64-bit integers but no native `uint32_t` (e.g. PHP, Lua) must
  implement the 32-bit multiply manually: a naïve `uint32 * uint32` exceeds
  `2^63 - 1` and silently overflows. The PHP reference splits one operand into
  16-bit halves; see
  [`Prng/Mulberry32.php::mul`](https://github.com/dicebear/dicebear/blob/10.x/src/php/core/src/Prng/Mulberry32.php).

### Key-based value generation

DiceBear does not call the PRNG sequentially. Instead, each random decision uses
a **key** to derive an independent value. This makes the output independent of
call order.

```
function getValue(seed: string, key: string) -> float:
    hash = fnv1a_hash(seed + ":" + key)
    prng = new Mulberry32(hash)
    return prng.nextFloat()
```

For example, `getValue("alice", "eyesVariant")` always returns the same float,
regardless of whether `getValue("alice", "mouthVariant")` was called before or
after.

### Selection methods

All selection methods **sort their inputs by string representation** using
UTF-16 code unit comparison (JavaScript's default `.sort()` order) before
operating on them. This ensures cross-language determinism.

In practice, the only values ever sorted are component variant names and hex
colour strings — both guaranteed to be ASCII. Implementations may use
locale-independent byte comparison (`strcmp`-style) and stay parity-correct,
even though the JavaScript reference compares full UTF-16 code units. The PHP
reference does exactly this with `strcmp`.

#### `pick(key, items) -> item | undefined`

Selects one item from an array.

```
function pick(seed, key, items):
    if items is empty: return undefined
    sorted = sort items by string representation (UTF-16 code unit order)
    if sorted has 1 item: return sorted[0]
    index = floor(getValue(seed, key) * length(sorted))
    return sorted[index]
```

#### `weightedPick(key, entries) -> item | undefined`

Selects from `[item, weight]` tuples, respecting weights.

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

Returns `true` with probability `likelihood / 100`.

```
function bool(seed, key, likelihood = 50):
    return getValue(seed, key) * 100 < likelihood
```

#### `float(key, values) -> number | undefined`

Returns a float within a range, rounded to 4 decimal places.

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

Returns an integer within a range (inclusive).

```
function integer(seed, key, values):
    if values is empty: return undefined
    if values has 1 item: return values[0]
    min = minimum(values)
    max = maximum(values)
    return floor(getValue(seed, key) * (max - min + 1)) + min
```

#### `shuffle(key, items) -> items[]`

Fisher-Yates shuffle using a **stateful** Mulberry32 instance (not key-based).

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

Note: `shuffle` is the only method that uses a stateful PRNG instance directly
(calling `nextFloat()` multiple times). All other methods call `getValue()`
which creates a fresh PRNG for each key.

## Options resolution

The `Options` class resolves raw user options into concrete values used by the
renderer. Each resolution uses the PRNG with a specific key.

### Core options

| Option            | PRNG key       | Resolution                                                                 |
| ----------------- | -------------- | -------------------------------------------------------------------------- |
| `seed`            | —              | Literal string; defaults to `''` if not provided. Not memoized.            |
| `size`            | —              | Literal number; defaults to unset (renderer omits `width`/`height`).       |
| `idRandomization` | —              | Boolean; defaults to `false`. Uses host RNG, not the DiceBear PRNG.        |
| `title`           | —              | Literal string; defaults to unset (omits `<title>`, uses `aria-hidden`).   |
| `flip`            | `flip`         | `pick` from `['none', 'horizontal', 'vertical', 'both']`, default `'none'` |
| `rotate`          | `rotate`       | `float` from range, default `0`                                            |
| `scale`           | `scale`        | `float` from range, default `1`                                            |
| `borderRadius`    | `borderRadius` | `float` from range, default `0`                                            |
| `translateX`      | `translateX`   | `float` from range, default `0`                                            |
| `translateY`      | `translateY`   | `float` from range, default `0`                                            |
| `fontFamily`      | `fontFamily`   | `pick` from array, default `'system-ui'`                                   |
| `fontWeight`      | `fontWeight`   | `pick` from array, default `400`                                           |

Options with no PRNG key are read directly from the user input. The rest sample
from a user-supplied range/list under the given key, falling back to the listed
default.

### Component options

For each component (e.g. `eyes`) the user can supply exactly two options:

| Option            | PRNG key          | Resolution                                                                             |
| ----------------- | ----------------- | -------------------------------------------------------------------------------------- |
| `eyesProbability` | `eyesProbability` | `bool` with likelihood, default from the component's `probability` (or `100` if unset) |
| `eyesVariant`     | `eyesVariant`     | `weightedPick` from the component's variants                                           |

If the probability check fails, the component is not rendered (variant returns
`undefined`).

For **component aliases** (declared via `extends` in the definition), the
options behave differently: aliases reuse the source component's
`${sourceName}Probability` user option, and they do not expose their own
`${aliasName}Probability`. The `${aliasName}Variant` option, however, is unique
to each alias — the PRNG samples a fresh variant per alias.

### Per-component transforms (render-time)

Each component reference also has a rotation, two translations, and a scale
applied at render time. These are **not user options** — they are sampled per
render from the component definition's `rotate`/`translate`/`scale` ranges and
**never appear in `resolvedOptions`**. Implementations that round-trip user
input must not expose them.

| Value      | PRNG key         | Sampling                                          |
| ---------- | ---------------- | ------------------------------------------------- |
| rotate     | `eyesRotate`     | `float` from `component.rotate`, default `0`      |
| translateX | `eyesTranslateX` | `float` from `component.translate.x`, default `0` |
| translateY | `eyesTranslateY` | `float` from `component.translate.y`, default `0` |
| scale      | `eyesScale`      | `float` from `component.scale`, default `1`       |

The translate values are percentages of the **component's own** `width` and
`height` (not the avatar canvas). Multiply by the component dimension, then
round to four decimal places (`round(x * 10000) / 10000`). The transform center
`(cx, cy)` for rotate and scale is the component's own center —
`(width / 2, height / 2)`.

In the emitted SVG, the values appear in a single `transform=""` attribute on
the `<use>` element, in this textual order (read left to right):

```
transform="translate(tx, ty) rotate(angle, cx, cy) translate(cx, cy) scale(s) translate(-cx, -cy)"
```

Any segment whose value is the identity (`tx=ty=0`, `angle=0`, `s=1`) is
omitted; if all segments are identity, the `transform` attribute is omitted
entirely.

### Color options

For each color group declared in the definition — **plus** an implicit
`background` group — the user can supply four options:

| Option                  | Type                               | PRNG key                | Notes                                                               |
| ----------------------- | ---------------------------------- | ----------------------- | ------------------------------------------------------------------- |
| `${name}Color`          | hex string or list                 | `${name}Color`          | Candidate colors (overrides the definition palette)                 |
| `${name}ColorFill`      | enum `solid` / `linear` / `radial` | `${name}ColorFill`      | Picks one when supplied as a list, default `solid`                  |
| `${name}ColorFillStops` | range (min 2)                      | `${name}ColorFillStops` | Number of gradient stops; ignored when fill is `solid`, default `2` |
| `${name}ColorAngle`     | range -360…360                     | `${name}ColorAngle`     | Gradient rotation, default `0`                                      |

Resolution for each group:

1. Get candidate colors from the user option (`${name}Color`) or fall back to
   the style definition's palette
2. Normalize all colors to hex
3. Determine number of stops: `1` if fill is `solid`, else sample
   `${name}ColorFillStops` (PRNG `integer`, default `2`)
4. Apply constraints from the style definition:
   - **`contrastTo`**: Sort candidates by WCAG 2.1 contrast ratio (descending)
     against the referenced color — do not shuffle
   - **`notEqualTo`**: Filter out colors already selected for referenced groups
5. If no `contrastTo` constraint: shuffle candidates
6. Slice to the number of stops

#### WCAG 2.1 contrast ratio

The contrast sort is the most likely source of subtle parity drift between ports
— small differences in the linearization cutoff or the luminance coefficients
change the ordering on certain palettes. Use these formulas exactly:

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

The cutoff is `0.04045`, the exponent is `2.4`, and the coefficients are
`0.2126 / 0.7152 / 0.0722` for R/G/B respectively. Sorting is descending by
`contrastRatio(candidate, refColor)`.

## SVG rendering pipeline

The renderer walks the element tree and generates an SVG string. The
transformations are applied in a specific order — getting this wrong will
produce different output.

### 1. Background

If a `backgroundColor` is set, render a `<rect>` covering the full canvas as the
first element.

### 2. Element tree

Walk the `canvas.elements` array recursively:

- **`element`**: Render as SVG tag with attributes. Resolve color references and
  variable references in attribute values.
- **`text`**: Render as escaped text content. Resolve variable references.
- **`component`**: Look up the selected variant (from options resolution). If
  the component is visible, emit a `<use>` element pointing at a `<defs>` entry
  that holds the variant body — see below.

When an `element` has the name `defs`, the renderer **does not** emit a `<defs>`
tag inline. Instead, each child of that element is rendered and pushed into the
shared `<defs>` block that the renderer accumulates over the whole walk
(alongside generated gradients, clip paths, and component variant bodies). This
lets style definitions ship reusable fragments without breaking the
single-`<defs>`-per-document invariant.

#### Component rendering

A component reference is never inlined. The first time the renderer encounters a
`(component, variant)` pair, it:

1. Renders the variant's element tree.
2. Wraps it in `<g id="{sourceName}-{variantName}-{seedHash}">…</g>` and appends
   it to the shared `<defs>` block. `sourceName` is the _source_ component name
   — for an alias declared via `extends`, this is the name of the component the
   alias points to, so every alias referencing the same source shares a single
   `<defs>` entry.
3. At the call site, emits `<use transform="…" href="#{id}"/>` (transform
   omitted when all per-component transforms are identity — see
   [Per-component transforms](#per-component-transforms-render-time)).

`seedHash` is the FNV-1a hex hash of the seed, lowercased and zero-padded to 8
characters.

### 3. Transform order

The body (background plus rendered elements) is wrapped in nested `<g>`
elements. The list below is **outermost → innermost** — the border-radius clip
is always emitted, the others only when their value is non-identity.

1. **Border radius (always)** — register a `<clipPath id="clip-{seedHash}">` in
   `<defs>` containing a `<rect width="{w}" height="{h}" rx="{rx}" ry="{ry}"/>`
   where `rx = (borderRadius / 100) * canvas.width` and
   `ry = (borderRadius / 100) * canvas.height`. Wrap the body in
   `<g clip-path="url(#clip-{seedHash})">`. **This wrap is emitted even when
   `borderRadius` is `0`** (with `rx="0" ry="0"`) so that transformed content
   cannot bleed past the canvas bounds.
2. **Translate** (skip if both are `0`) — `<g transform="translate(dx, dy)">`
   where `dx = (translateX / 100) * canvas.width` and
   `dy = (translateY / 100) * canvas.height`.
3. **Rotate** (skip if `0`) — `<g transform="rotate(angle, cx, cy)">` around
   canvas center, `cx = width / 2`, `cy = height / 2`.
4. **Flip** (skip if `none`) — depends on mode:
   - `horizontal`: `translate(width, 0) scale(-1, 1)`
   - `vertical`: `translate(0, height) scale(1, -1)`
   - `both`: `translate(width, height) scale(-1, -1)`
5. **Scale** (skip if `1`) —
   `<g transform="translate(cx, cy) scale(s) translate(-cx, -cy)">` where
   `cx = width / 2`, `cy = height / 2`.

Because border-radius is always wrapping the body, the rendered SVG always
contains a `<defs>` block with at least the `<clipPath>` entry.

### 4. SVG root element

The root `<svg>` element's attributes, in this order:

1. `xmlns="http://www.w3.org/2000/svg"`
2. `viewBox="0 0 {width} {height}"`
3. Global `attributes` from the style definition (each escaped via `Xml.escape`)
4. Either `role="img" aria-label="{title}"` (when `title` is set, escaped) or
   `aria-hidden="true"`
5. `width="{size}"` and `height="{size}"` (only when the `size` option is set)

Its children, in this exact order:

1. `<metadata>` — the Dublin Core / RDF block from `meta` (see below); omitted
   entirely if `meta` is empty.
2. `<defs>` — the accumulated definitions (clip path, gradients, component
   variant bodies). Always present in practice because the border-radius clip is
   always registered.
3. `<title>` — only when the `title` option is set. Contents are escaped.
4. The transformed body from the previous step.

#### `<metadata>` block

The license/attribution metadata is emitted as a real `<metadata>` element with
RDF / Dublin Core terms — **not** as an HTML comment:

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
      <dc:rights>{attribution text}</dc:rights>
    </rdf:Description>
  </rdf:RDF>
</metadata>
```

Each `dc:*` / `dcterms:*` field is only included when the corresponding `meta`
field is populated; if no field is populated, the `<metadata>` element is
omitted entirely. All text content is XML-escaped. The `<dc:rights>` value is a
single-line attribution string composed from `source`, `creator`, and `license`
(prefixed with `Remix of ` unless the style is MIT-licensed, authored by
DiceBear itself, or has no `source.name`).

### 5. ID randomization

When `idRandomization` is `true`, append a random suffix to every existing `id`
attribute and update every matching reference. The replacement patterns are
`id="…"`, `url(#…)`, and `href="#…"` — each occurrence is rewritten to
`{original}-{suffix}`.

The suffix format is **6 lowercase hex characters**, left-padded with zeros: in
JavaScript,
`Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')`.

The suffix **must be non-deterministic**: derive it from the host language's
non-seeded RNG (`Math.random()` in JavaScript, `random_int()` in PHP), not from
the DiceBear PRNG. Two avatars rendered with the same seed would otherwise still
collide on their IDs, defeating the purpose of the feature. Because the
randomized output is non-deterministic, it is excluded from parity testing — the
avatar fixtures use the default of `idRandomization: false`.

## Gradient rendering

When a color group has multiple stops (fill is `linear` or `radial`):

1. Create a `<linearGradient>` or `<radialGradient>` in `<defs>`
2. Calculate stop offsets: `round(i / (count - 1) * 100)%`
3. Apply gradient rotation via `gradientTransform="rotate(angle, 0.5, 0.5)"`
4. Reference via `url(#gradient-id)` in fill attributes
5. Gradient ID format: `{colorName}-color-{seedHash}` where `seedHash` is the
   FNV-1a hex hash of the seed (8 chars, zero-padded)

## Initials extraction

The `initial` and `initials` variables are derived from the seed:

1. Strip `@...` suffix (for email addresses)
2. Remove apostrophe-like characters (`` ` ´ ' ʼ ``)
3. Match Unicode letter sequences (`\p{L}[\p{L}\p{M}]*`)
4. If one word: take first 1-2 characters (respecting combining marks)
5. If multiple words: take first character of first and last word
6. Convert to uppercase

## Testing your implementation

The DiceBear repository ships a language-neutral parity test suite at
[`tests/fixtures/parity/`](https://github.com/dicebear/dicebear/tree/10.x/tests/fixtures/parity).
It is the canonical way to verify a new implementation: the JavaScript and PHP
reference implementations both consume the same JSON fixtures and assert the
same outputs, so any port that reads these fixtures gets the same coverage for
free.

The fixture tree contains:

- **`fnv1a.json`** — input strings with their expected 32-bit hash and 8-char
  hex representation. Includes ASCII, the `seed:key` patterns produced by
  `Prng.getValue()`, and Unicode (`„é"`, `„日本語"`, emoji, long strings).
- **`mulberry32.json`** — seeds with the first 5 chained `{nextFloat, state}`
  pairs each. Catches state-progression bugs, not just first-step bugs.
- **`prng.json`** — every `Prng` method (`getValue`, `pick`, `weightedPick`,
  `bool`, `float`, `integer`, `shuffle`) with `{seed, key, args, result}` test
  cases, including order-independence checks for `pick` / `weightedPick` /
  `shuffle`.
- **`styles/{initials,thumbs,glass,notionists}.json`** — vendored copies of four
  style definitions chosen to cover most rendering features (text, components,
  color overrides, gradient fills, root SVG attributes).
- **`avatars/{initials,thumbs,glass,notionists}.json`** —
  `{id, options, svg, resolvedOptions}` cases per style, exercising seed, size,
  scale, rotate, translate, border radius, flip, background gradients
  (solid/linear/radial), component variant overrides, and style-specific options
  like `fontFamily` and `gestureVariant`.

### How to use the fixtures

For each fixture entry, your implementation must produce the recorded result
exactly:

```text
fnv1a:      Fnv1a::hash(input)        == entry.hash
            Fnv1a::hex(input)         == entry.hex
mulberry32: m = Mulberry32(seed);
            for each {float, state} in sequence:
              m.nextFloat() == float && m.state() == state
prng:       Prng(seed).<method>(key, args) == result
avatar:     Avatar(style, options).toString() == svg   (byte-for-byte)
```

Start with `fnv1a.json` and `mulberry32.json` — these are pure functions and the
easiest to debug. Once those are green, the `prng.json` cases will tell you
whether your sort order, weighted-pick threshold, and Fisher–Yates loop match.
Only then move on to the avatar fixtures, which compose everything.

The `resolvedOptions` field on each avatar fixture contains only the options
that were actually touched during resolution — unset options (`title`, `size`
when not provided, etc.) do not appear. The JavaScript reference relies on
`JSON.stringify()` dropping `undefined` values at the serialization boundary;
the PHP reference filters `null` values explicitly in `Options::resolved()`.
Both produce the same shape. A port that returns the full memo map verbatim will
fail the comparison — strip unset entries before serializing.

### Regenerating the fixtures

The fixtures are produced from the JavaScript reference implementation:

```bash
npm run fixtures:parity
```

This rewrites every file under `tests/fixtures/parity/` from `@dicebear/core`.
You only need to run this if you have intentionally changed the JS rendering
output and want to update the expected values for every implementation.

### Manual SVG comparison

For ad-hoc spot checks beyond the fixtures, you can also generate reference SVGs
from the CLI and compare byte-for-byte:

```bash
dicebear initials ./reference --seed "Alice" --count 1
dicebear lorelei ./reference --seed "Alice" --count 1
dicebear avataaars ./reference --seed "Alice" --count 1
```

Start with the `initials` style (simplest) and work up to more complex styles
with multiple components and color constraints.

## Reference implementations

| Language   | Package          | Source                                                                               |
| ---------- | ---------------- | ------------------------------------------------------------------------------------ |
| JavaScript | `@dicebear/core` | [src/js/core/src/](https://github.com/dicebear/dicebear/tree/10.x/src/js/core/src)   |
| PHP        | `dicebear/core`  | [src/php/core/src/](https://github.com/dicebear/dicebear/tree/10.x/src/php/core/src) |
