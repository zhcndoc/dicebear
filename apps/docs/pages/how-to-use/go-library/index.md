---
title: Go Avatar Library | DiceBear
description: >
  使用 DiceBear Go 库在服务器上生成 SVG 个人头像。Go
  1.23+，并且 API 与 JavaScript 库完全一致。
---

# Go 头像库

Go 库提供与
[JavaScript 库](/how-to-use/js-library/) 完全一致的 API。它需要 Go 1.23 或更高版本。
相同的种子和样式定义会生成与 JavaScript
参考实现字节完全一致的 SVG。

## 安装

你需要两个模块：核心库 `github.com/dicebear/dicebear-go/v10` 和
头像样式定义 `github.com/dicebear/styles/v10`。模块路径
包含主版本号，因此请使用 `/v10` 后缀导入。

```sh
go get github.com/dicebear/dicebear-go/v10
go get github.com/dicebear/styles/v10
```

## 使用

我们在示例中使用头像样式 [lorelei](/styles/lorelei/)。你可以在
[这里](/styles/)找到更多头像样式。每种样式都会以原始 JSON 字符串形式导出
（例如 `styles.Lorelei`），然后传递给 `NewStyle`。

```go
package main

import (
	"fmt"

	dicebear "github.com/dicebear/dicebear-go/v10"
	"github.com/dicebear/styles/v10"
)

func main() {
	style, err := dicebear.NewStyle([]byte(styles.Lorelei))
	if err != nil {
		panic(err)
	}

	avatar, err := dicebear.NewAvatar(style, map[string]any{
		"seed": "John",
		// ... 其他选项
	})
	if err != nil {
		panic(err)
	}

	svg := avatar.SVG()
	fmt.Println(svg)
}
```

每种头像样式都带有若干选项。你可以在每个[头像样式](/styles/)的详情页中找到它们。

:::info

我们提供了来自不同艺术家的大量头像样式。这些头像样式采用不同的许可证，
由艺术家自行选择。为了便于快速了解，我们为你创建了一个
[许可证概览](/licenses/)。

:::

## 确定性头像

`seed` 选项是生成确定性头像的关键。相同的 seed
总是会生成相同的头像：

```go
avatar1, _ := dicebear.NewAvatar(style, map[string]any{"seed": "user-123"})
avatar2, _ := dicebear.NewAvatar(style, map[string]any{"seed": "user-123"})

// avatar1.SVG() == avatar2.SVG()
```

## 类型

### `Style`

一个经过验证、不可变的样式定义包装器。先使用
`NewStyle`（基于定义的 JSON 字节）构建一次，然后在生成多个头像时复用它。

```go
style, err := dicebear.NewStyle(definitionJSON)
if err != nil {
	panic(err)
}

avatar1, _ := dicebear.NewAvatar(style, map[string]any{"seed": "Alice"})
avatar2, _ := dicebear.NewAvatar(style, map[string]any{"seed": "Bob"})
```

### `Avatar`

生成头像的主要类型。`NewAvatar` 接收一个 `*Style` 和一个
`map[string]any` 形式的选项，并返回 `(*Avatar, error)`（无效选项和
循环颜色引用会以 `error` 形式返回）。`nil` 选项映射会被视为空映射。

```go
avatar, err := dicebear.NewAvatar(style, map[string]any{
	// ... 选项
})
```

### `OptionsDescriptor`

描述给定样式的所有有效选项。适用于构建界面或
验证用户输入。

```go
descriptor := dicebear.NewOptionsDescriptor(style).ToJSON()
```

## 方法

### `SVG()` / `String()`

**返回类型：** `string`

以 XML 格式返回 SVG 头像。`Avatar` 还实现了 `fmt.Stringer`，
因此可以直接用于字符串上下文中（`fmt.Println`、`fmt.Sprintf`）。

```go
avatar, _ := dicebear.NewAvatar(style, map[string]any{"seed": "Alice"})

svg := avatar.SVG()
// 或者
svg = avatar.String()
```

### `JSON()`

**返回类型：** `[]byte`（包含键 `svg` 和 `options` 的 JSON），`error`

以 JSON 形式返回 SVG 和已解析的选项。

```go
avatar, _ := dicebear.NewAvatar(style, map[string]any{"seed": "Alice"})

result, _ := avatar.JSON()

// result → {"svg":"<svg>...</svg>","options":{"flip":"none",...}}
```

已解析的选项也可以通过
`avatar.ResolvedOptions()` 直接作为 map 获取。

### `DataURI()`

**返回类型：** `string`

以 [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme) 形式返回头像。

```go
avatar, _ := dicebear.NewAvatar(style, map[string]any{"seed": "Alice"})

dataURI := avatar.DataURI()

// <img src="{dataURI}" alt="头像" />
```

## 核心选项

核心选项与 JavaScript 库完全一致。完整参考请参见
[JS 库核心选项](/how-to-use/js-library/#core-options)。以下是 Go 语法中的选项：

```go
avatar, _ := dicebear.NewAvatar(style, map[string]any{
	"seed":                "Alice",
	"flip":                "horizontal",            // "none", "horizontal", "vertical", "both"
	"rotate":              10,                       // -360 to 360, or [min, max] range
	"scale":               0.9,                      // 0 to 10 (1 = original), or [min, max] range
	"borderRadius":        50,                       // 0-50 (50 = circle)
	"size":                128,
	"translateX":          0,                        // -1000 to 1000 (percent of canvas width)
	"translateY":          0,                        // -1000 to 1000 (percent of canvas height)
	"idRandomization":     true,
	"title":               "User Avatar",
	"fontFamily":          "Arial",                  // or []string{"Arial", "Helvetica"}
	"fontWeight":          700,                      // 1-1000
	"backgroundColor":     []string{"#b6e3f4", "#c0aede"},
	"backgroundColorFill": "solid",                  // "solid", "linear", "radial"
})
```

动态组件和颜色选项也以相同方式工作。请参阅
[JS 库文档](/how-to-use/js-library/#dynamic-component-options)
了解所有可用模式。

## 示例

### 自定义背景的头像

```go
avatar, _ := dicebear.NewAvatar(style, map[string]any{
	"seed":            "Alice",
	"backgroundColor": []string{"#b6e3f4", "#c0aede", "#d1d4f9"},
})
```

### 固定尺寸头像

```go
style, _ := dicebear.NewStyle([]byte(styles.Bottts))

avatar, _ := dicebear.NewAvatar(style, map[string]any{
	"seed":         "robot-42",
	"size":         128,
	"borderRadius": 50, // circular avatar
})
```

### 带变换的头像

```go
style, _ := dicebear.NewStyle([]byte(styles.Avataaars))

avatar, _ := dicebear.NewAvatar(style, map[string]any{
	"seed":       "Jane",
	"flip":       "horizontal",
	"rotate":     10,
	"scale":      0.9,
	"translateY": 5,
})
```

### 同一页面上的多个头像

在同一页面渲染多个头像时，请使用 `idRandomization` 以
防止 SVG ID 冲突：

```go
style, _ := dicebear.NewStyle([]byte(styles.Lorelei))

for _, seed := range []string{"alice", "bob", "charlie"} {
	avatar, _ := dicebear.NewAvatar(style, map[string]any{
		"seed":            seed,
		"idRandomization": true,
	})
	fmt.Println(avatar.SVG())
}
```

### 加权变体选择

```go
avatar, _ := dicebear.NewAvatar(style, map[string]any{
	"seed":     "Alice",
	"topVariant": map[string]any{"short01": 2, "short02": 2, "long01": 1},
})
```
