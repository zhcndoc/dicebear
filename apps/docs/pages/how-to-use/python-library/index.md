---
title: Python 头像库
description: >
  使用 DiceBear Python 库在服务器端生成 SVG 头像。Python 3.10+，并且 API 与 JavaScript、PHP、Rust 和
  Go 库完全一致。
---

# Python 头像库

Python 库提供与 [JavaScript 库](/how-to-use/js-library/) 完全一致的 API。它要求 Python 3.10 或更高版本。相同的 seed 和样式定义生成的 SVG 与 JavaScript 参考实现逐字节一致。

## 安装

您需要两个包：核心库 `dicebear-core` 和头像样式定义 `dicebear-styles`。

```bash
pip install dicebear-core dicebear-styles
```

## 使用

我们在示例中使用头像样式 [lorelei](/styles/lorelei/)。你可以在[这里](/styles/)找到更多头像样式。

```python
from importlib.resources import files

from dicebear import Avatar, Style

style = Style.from_json(
    files("dicebear_styles").joinpath("lorelei.json").read_text("utf-8")
)

avatar = Avatar(style, {
    "seed": "John",
    # ... 其他选项
})

svg = avatar.to_string()
```

每种头像样式都带有若干选项。你可以在每个[头像样式](/styles/)的详情页找到它们。

:::info

我们提供了来自不同艺术家的大量头像样式。这些头像样式采用不同的许可证，艺术家可以自行选择。为了便于快速浏览，我们为你创建了一个[许可证概览](/licenses/)。

:::

## 确定性头像

`seed` 选项是生成确定性头像的关键。相同的 seed 总是会生成相同的头像：

```python
avatar1 = Avatar(style, {"seed": "user-123"})
avatar2 = Avatar(style, {"seed": "user-123"})

avatar1.to_string() == avatar2.to_string()  # True
```

## 类

### `Avatar`

用于生成头像的主类。传入一个 `Style` 实例和可选
选项。

```python
from dicebear import Avatar

avatar = Avatar(style, {
    # ... 选项
})
```

### `Style`

对样式定义的不可变包装。用于从同一种样式生成多个头像时复用它。

```python
from dicebear import Avatar, Style

style = Style(definition)

avatar1 = Avatar(style, {"seed": "Alice"})
avatar2 = Avatar(style, {"seed": "Bob"})
```

### `OptionsDescriptor`

描述给定样式的所有有效选项。适用于构建 UI 或验证用户输入。

```python
from dicebear import OptionsDescriptor, Style

descriptor = OptionsDescriptor(Style(definition))
fields = descriptor.to_json()
```

## 方法

### `to_string()` / `str(avatar)`

**返回类型：** `str`

以 XML 格式返回 SVG 形式的头像。`__str__` 方法允许直接在字符串上下文中使用头像。

```python
avatar = Avatar(style, {"seed": "Alice"})

svg = avatar.to_string()
# 或
svg = str(avatar)
```

### `to_json()`

**返回类型：** 带有 `svg` 和 `options` 键的 `dict`

返回一个包含 SVG 和已解析选项的字典。

```python
avatar = Avatar(style, {"seed": "Alice"})

result = avatar.to_json()

# result["svg"]     → '<svg>...</svg>'
# result["options"] → {"seed": "Alice", ...}
```

### `to_data_uri()`

**返回类型：** `str`

以 [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme) 形式返回头像。

```python
avatar = Avatar(style, {"seed": "Alice"})

data_uri = avatar.to_data_uri()

# <img src="{data_uri}" alt="头像" />
```

## 核心选项

核心选项与 JavaScript 库完全一致。完整参考请查看 [JS Library core options](/how-to-use/js-library/#core-options)。以下是 Python 语法中的选项：

```python
avatar = Avatar(style, {
    "seed": "Alice",
    "flip": "horizontal",            # "none", "horizontal", "vertical", "both"
    "rotate": 10,                    # -360 到 360，或 [min, max] 范围
    "scale": 0.9,                    # 0 到 10（1 = 原始大小），或 [min, max] 范围
    "borderRadius": 50,              # 0-50（50 = 圆形）
    "size": 128,
    "translateX": 0,                 # -1000 到 1000（画布宽度的百分比）
    "translateY": 0,                 # -1000 到 1000（画布高度的百分比）
    "idRandomization": True,
    "title": "用户头像",
    "fontFamily": "Arial",           # 或 ["Arial", "Helvetica"]
    "fontWeight": 700,               # 1-1000
    "backgroundColor": ["#b6e3f4", "#c0aede"],
    "backgroundColorFill": "solid",  # "solid", "linear", "radial"
})
```

动态组件和颜色选项的工作方式也相同。有关所有可用模式，请参阅 [JS Library documentation](/how-to-use/js-library/#dynamic-component-options)。

## 示例

### 自定义背景头像

```python
avatar = Avatar(style, {
    "seed": "Alice",
    "backgroundColor": ["#b6e3f4", "#c0aede", "#d1d4f9"],
})
```

### 固定尺寸头像

```python
from importlib.resources import files

from dicebear import Avatar, Style

style = Style.from_json(
    files("dicebear_styles").joinpath("bottts.json").read_text("utf-8")
)

avatar = Avatar(style, {
    "seed": "robot-42",
    "size": 128,
    "borderRadius": 50,  # 圆形头像
})
```

### 带变换的头像

```python
from importlib.resources import files

from dicebear import Avatar, Style

style = Style.from_json(
    files("dicebear_styles").joinpath("avataaars.json").read_text("utf-8")
)

avatar = Avatar(style, {
    "seed": "Jane",
    "flip": "horizontal",
    "rotate": 10,
    "scale": 0.9,
    "translateY": 5,
})
```

### 同一页面上的多个头像

在同一页面渲染多个头像时，请使用 `idRandomization` 来防止 SVG ID 冲突：

```python
from dicebear import Avatar, Style

style = Style(definition)
users = ["alice", "bob", "charlie"]

avatars = [
    Avatar(style, {"seed": user, "idRandomization": True}).to_string()
    for user in users
]
```

### 权重变体选择

```python
avatar = Avatar(style, {
    "seed": "Alice",
    "topVariant": {"short01": 2, "short02": 2, "long01": 1},
})
```
