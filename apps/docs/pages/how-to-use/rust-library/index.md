---
title: Rust 头像库
description: >
  在服务器端使用 DiceBear Rust 库生成 SVG 头像。
  Rust 1.80+，API 与 JavaScript 库完全一致。
---

# Rust 头像库

Rust 库提供与 [JavaScript 库](/how-to-use/js-library/) 完全一致的 API。它需要 Rust 1.80 或更高版本。相同的 seed 和样式定义会生成与 JavaScript 参考实现字节级一致的 SVG。

## 安装

你需要两个 crate：核心库 `dicebear-core` 和头像样式定义 `dicebear-styles`（每个样式都位于同名 feature 后面）。选项会以 `serde_json::Value` 传入，因此也请添加 `serde_json`。

```sh
cargo add dicebear-core serde_json
cargo add dicebear-styles --features lorelei
```

## 使用

在示例中我们使用头像样式 [lorelei](/styles/lorelei/)。你可以在 [这里](/styles/) 找到更多头像样式。

```rust
use dicebear_core::{Avatar, Style};
use serde_json::json;

let style = Style::from_str(dicebear_styles::LORELEI)?;

let avatar = Avatar::new(&style, json!({
    "seed": "John",
    // ... 其他选项
}))?;

let svg = avatar.to_svg();
```

每种头像样式都带有若干选项。你可以在每个 [头像样式](/styles/) 的详情页中找到它们。

:::info

我们提供了来自不同艺术家的大量头像样式。这些头像样式采用的许可证各不相同，由艺术家自行选择。为了便于快速查看，我们为你创建了一个 [许可证概览](/licenses/)。

:::

## 确定性头像

`seed` 选项是生成确定性头像的关键。相同的 seed 总是会生成相同的头像：

```rust
let avatar1 = Avatar::new(&style, json!({ "seed": "user-123" }))?;
let avatar2 = Avatar::new(&style, json!({ "seed": "user-123" }))?;

assert_eq!(avatar1.to_svg(), avatar2.to_svg());
```

## 类型

### `Style`

一个经过验证的、不可变的样式定义包装器。使用 `Style::from_str`（来自 JSON 字符串）或 `Style::from_value`（来自 `serde_json::Value`）创建一次，然后在生成多个头像时重复使用。

```rust
use dicebear_core::{Avatar, Style};
use serde_json::json;

let style = Style::from_str(definition_json)?;

let avatar1 = Avatar::new(&style, json!({ "seed": "Alice" }))?;
let avatar2 = Avatar::new(&style, json!({ "seed": "Bob" }))?;
```

### `Avatar`

用于生成头像的主要类型。`Avatar::new` 接受一个 `&Style` 和包含选项的 `serde_json::Value`，并返回 `Result<Avatar, Error>`（无效选项和循环颜色引用会作为 `Error` 抛出）。

```rust
use dicebear_core::{Avatar, Style};
use serde_json::json;

let avatar = Avatar::new(&style, json!({
    // ... 选项
}))?;
```

### `OptionsDescriptor`

描述给定样式的所有有效选项。适用于构建 UI 或验证用户输入。

```rust
use dicebear_core::{OptionsDescriptor, Style};

let descriptor = OptionsDescriptor::new(&style).to_json();
```

## 方法

### `to_svg()` / `to_string()`

**返回类型：** `&str` / `String`

以 XML 格式返回 SVG 头像。`Avatar` 还实现了 `Display`，因此可以直接在字符串上下文中使用（`format!`、`println!`、`.to_string()`）。

```rust
let avatar = Avatar::new(&style, json!({ "seed": "Alice" }))?;

let svg = avatar.to_svg();
// 或
let svg = avatar.to_string();
```

### `to_json()`

**返回类型：** 带有 `svg` 和 `options` 键的 `serde_json::Value`

返回一个包含 SVG 和解析后选项的值。

```rust
let avatar = Avatar::new(&style, json!({ "seed": "Alice" }))?;

let result = avatar.to_json();

// result["svg"]     → "<svg>...</svg>"
// result["options"] → { "seed": "Alice", ... }
```

### `to_data_uri()`

**返回类型：** `String`

以 [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme) 形式返回头像。

```rust
let avatar = Avatar::new(&style, json!({ "seed": "Alice" }))?;

let data_uri = avatar.to_data_uri();

// <img src="{data_uri}" alt="头像" />
```

## 核心选项

核心选项与 JavaScript 库完全一致。完整参考请见 [JS Library core options](/how-to-use/js-library/#core-options)。以下是 Rust 语法中的选项：

```rust
let avatar = Avatar::new(&style, json!({
    "seed": "Alice",
    "flip": "horizontal",            // "none", "horizontal", "vertical", "both"
    "rotate": 10,                    // -360 到 360，或 [min, max] 范围
    "scale": 0.9,                    // 0 到 10（1 = 原始大小），或 [min, max] 范围
    "borderRadius": 50,              // 0-50（50 = 圆形）
    "size": 128,
    "translateX": 0,                 // -1000 到 1000（画布宽度的百分比）
    "translateY": 0,                 // -1000 到 1000（画布高度的百分比）
    "idRandomization": true,
    "title": "用户头像",
    "fontFamily": "Arial",           // 或 ["Arial", "Helvetica"]
    "fontWeight": 700,               // 1-1000
    "backgroundColor": ["#b6e3f4", "#c0aede"],
    "backgroundColorFill": "solid",  // "solid", "linear", "radial"
}))?;
```

动态组件和颜色选项也同样适用。有关所有可用模式，请参阅 [JS Library documentation](/how-to-use/js-library/#dynamic-component-options)。

## 示例

### 带自定义背景的头像

```rust
let avatar = Avatar::new(&style, json!({
    "seed": "Alice",
    "backgroundColor": ["#b6e3f4", "#c0aede", "#d1d4f9"],
}))?;
```

### 固定尺寸头像

```rust
use dicebear_core::{Avatar, Style};
use serde_json::json;

let style = Style::from_str(dicebear_styles::BOTTTS)?;

let avatar = Avatar::new(&style, json!({
    "seed": "robot-42",
    "size": 128,
    "borderRadius": 50, // 圆形头像
}))?;
```

### 带变换的头像

```rust
use dicebear_core::{Avatar, Style};
use serde_json::json;

let style = Style::from_str(dicebear_styles::AVATAAARS)?;

let avatar = Avatar::new(&style, json!({
    "seed": "Jane",
    "flip": "horizontal",
    "rotate": 10,
    "scale": 0.9,
    "translateY": 5,
}))?;
```

### 同一页面上的多个头像

当在同一页面渲染多个头像时，请使用 `idRandomization` 以防止 SVG ID 冲突：

```rust
let style = Style::from_str(dicebear_styles::LORELEI)?;

let avatars: Vec<String> = ["alice", "bob", "charlie"]
    .iter()
    .map(|seed| {
        Avatar::new(&style, json!({ "seed": seed, "idRandomization": true }))
            .map(|a| a.to_svg().to_string())
    })
    .collect::<Result<_, _>>()?;
```

### 加权变体选择

```rust
let avatar = Avatar::new(&style, json!({
    "seed": "Alice",
    "topVariant": { "short01": 2, "short02": 2, "long01": 1 },
}))?;
```
