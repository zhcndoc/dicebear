---
title: 从零创建头像风格
description: >
  了解如何通过编写 JSON 定义文件，从零创建一个 DiceBear 头像风格。无需 Figma 或设计工具。
---

# 从零创建头像风格

我们强烈推荐使用我们的
[Figma 插件](/guides/create-an-avatar-style-with-figma/) 来创建头像
风格。DiceBear 的大多数官方头像风格都是使用该插件创建的。
不过，你也可以通过手动编写 JSON
[定义文件](/specification/definition-schema/) 来创建头像风格。

## 最小示例

一个带有彩色圆形的最小风格定义：

```json
{
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
      }
    ]
  },
  "colors": {
    "background": {
      "values": ["#f94144", "#f9c74f", "#90be6d", "#43aa8b", "#577590"]
    }
  }
}
```

将其保存为 `my-style.json` 并进行测试：

```
dicebear ./my-style.json ./output --count 5
```

PRNG 会为每个种子选择不同的背景颜色。

## 添加组件

组件是头像中可随机化的部分。每个组件都有多个变体，PRNG 可以从中选择。

让我们添加一个带有两个变体的 face 组件：

```json
{
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
              "name": "circle",
              "attributes": { "cx": "35", "cy": "40", "r": "4", "fill": "#000" }
            },
            {
              "type": "element",
              "name": "circle",
              "attributes": { "cx": "65", "cy": "40", "r": "4", "fill": "#000" }
            },
            {
              "type": "element",
              "name": "path",
              "attributes": {
                "d": "M 30 60 Q 50 80 70 60",
                "stroke": "#000",
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
              "name": "circle",
              "attributes": { "cx": "35", "cy": "40", "r": "4", "fill": "#000" }
            },
            {
              "type": "element",
              "name": "circle",
              "attributes": { "cx": "65", "cy": "40", "r": "4", "fill": "#000" }
            },
            {
              "type": "element",
              "name": "line",
              "attributes": {
                "x1": "35",
                "y1": "62",
                "x2": "65",
                "y2": "62",
                "stroke": "#000",
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
      "values": ["#f94144", "#f9c74f", "#90be6d", "#43aa8b", "#577590"]
    }
  }
}
```

`canvas.elements` 数组通过 `{ "type": "component", "name": "face" }` 引用了 `face` 组件。PRNG 会选择 `smile` 或 `neutral` 变体之一。

## Multiple Components

You can add any number of components. Each component is independent: the PRNG selects a variant separately for each component.

```json
{
  "components": {
    "eyes": {
      "width": 100,
      "height": 100,
      "variants": {
        "round": { "elements": [...] },
        "narrow": { "elements": [...] }
      }
    },
    "mouth": {
      "width": 100,
      "height": 100,
      "variants": {
        "smile": { "elements": [...] },
        "open": { "elements": [...] },
        "flat": { "elements": [...] }
      }
    },
    "accessories": {
      "width": 100,
      "height": 100,
      "probability": 30,
      "variants": {
        "glasses": { "elements": [...] },
        "hat": { "elements": [...] }
      }
    }
  }
}
```

### Probability

The `probability` property (0-100) controls how often a component appears. In the example above, `accessories` will only appear in about 30% of generated avatars. The default is `100` (always visible).

### Variant Weighting

Control how often specific variants are selected:

```json
{
  "variants": {
    "common": { "weight": 3, "elements": [...] },
    "uncommon": { "weight": 1, "elements": [...] },
    "rare": { "weight": 0, "elements": [...] }
  }
}
```

Higher weight = more likely to be selected. A weight of `0` is only selected if all other weights are also `0`. The default weight is `1`.

### Component Transformations

Components can have default rotation, translation, and scaling ranges, sampled by the PRNG on each render. All four fields use the same `{ min, max, step? }` range object. See [Ranges](/specification/definition-schema/#ranges) for the full reference.

```json
{
  "eyes": {
    "width": 80,
    "height": 40,
    "rotate": { "min": -5, "max": 5 },
    "scale": { "min": 0.95, "max": 1.05 },
    "translate": {
      "x": { "min": -2, "max": 2 },
      "y": { "min": -3, "max": 3 }
    },
    "variants": { ... }
  }
}
```

If you want a fixed value, set `min === max`; or add `"step": <n>` to quantize the range into discrete intervals.

## 颜色调色板

可以在元素属性中引用颜色。PRNG 会为每个头像从调色板中选择一个值。

```json
{
  "colors": {
    "skin": {
      "values": ["#f5d6c3", "#d4a889", "#a67c5b", "#614335"]
    },
    "hair": {
      "values": ["#2c1b18", "#b58143", "#d6b370", "#724133"],
      "notEqualTo": ["skin"]
    },
    "text": {
      "values": ["#ffffff", "#000000"],
      "contrastTo": "background"
    }
  }
}
```

### 颜色引用

在 SVG 属性中使用颜色引用以应用动态颜色：

```json
{
  "type": "element",
  "name": "circle",
  "attributes": {
    "fill": { "type": "color", "name": "skin" }
  }
}
```

### 颜色约束

**`notEqualTo`** 可防止两个颜色组选择相同的颜色。在上面的示例中，`hair` 的颜色永远不会与 `skin` 相同。

**`contrastTo`** 会选择与所引用颜色组相比对比度最高的颜色。这有助于确保文本在背景上可读。

## 元数据

为你的定义添加元数据以进行许可证署名：

```json
{
  "meta": {
    "license": {
      "name": "CC BY 4.0",
      "url": "https://creativecommons.org/licenses/by/4.0/",
      "text": "完整许可证文本..."
    },
    "creator": {
      "name": "你的名字",
      "url": "https://your-website.com"
    },
    "source": {
      "name": "我的风格",
      "url": "https://github.com/your/repo"
    }
  }
}
```

此元数据会出现在：

- 生成的 SVG 内部的 `<metadata>` RDF 块中（Dublin Core 术语；参见
  [核心实现规范](/specification/implement-dicebear-core/#metadata-block)）
- CLI 许可证横幅中
- 文档中（如果你的风格被添加到官方集合中）

## 模式验证

添加 `$schema` 属性以在你的编辑器中启用验证：

```json
{
  "$schema": "https://cdn.hopjs.net/npm/@dicebear/schema@1.0.0/dist/definition.min.json",
  "canvas": { ... }
}
```

大多数编辑器（VS Code、WebStorm 等）都会为你的定义文件提供自动补全和行内验证。

## 测试

### 使用 CLI

```
dicebear ./my-style.json ./output --count 10
dicebear ./my-style.json ./output --seed "Alice" --format png
```

### 使用 JS 库

```js
import { Style, Avatar } from '@dicebear/core';
import definition from './my-style.json' with { type: 'json' };

const style = new Style(definition);
const avatar = new Avatar(style, { seed: 'test' });
console.log(avatar.toString());
```

### 使用 PHP 库

```php
use DiceBear\Avatar;
use DiceBear\Style;

$style = Style::fromJson(file_get_contents('./my-style.json'));
$avatar = new Avatar($style, ['seed' => 'test']);
echo (string) $avatar;
```

### 使用 Python 库

```python
from pathlib import Path

from dicebear import Avatar, Style

style = Style.from_json(Path("./my-style.json").read_text("utf-8"))
avatar = Avatar(style, {"seed": "test"})
print(avatar.to_string())
```

### 使用 Rust 库

```rust
use dicebear_core::{Avatar, Style};
use serde_json::json;
use std::fs;

let definition = fs::read_to_string("./my-style.json")?;
let style = Style::from_str(&definition)?;

let avatar = Avatar::new(&style, json!({ "seed": "test" }))?;
println!("{}", avatar.to_svg());
```

### 使用 Go 库

```go
import (
	"fmt"
	"os"

	dicebear "github.com/dicebear/dicebear-go/v10"
)

definition, _ := os.ReadFile("./my-style.json")
style, _ := dicebear.NewStyle(definition)

avatar, _ := dicebear.NewAvatar(style, map[string]any{"seed": "test"})
fmt.Println(avatar.SVG())
```

### 使用 Dart 库

```dart
import 'dart:io';

import 'package:dicebear_core/dicebear_core.dart';

final style = Style.parse(File('./my-style.json').readAsStringSync());

final avatar = Avatar(style, {'seed': 'test'});
print(avatar.svg);
```

## 下一步

- 查看 [定义模式参考](/specification/definition-schema/) 以获取完整规范
- 浏览 [官方定义](https://github.com/dicebear/styles) 以查看真实示例
- 使用 [Figma 插件](/guides/create-an-avatar-style-with-figma/) 进行可视化工作流
