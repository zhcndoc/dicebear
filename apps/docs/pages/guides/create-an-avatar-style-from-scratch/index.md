---
title: 从零创建头像风格 | DiceBear
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

`canvas.elements` 数组通过
`{ "type": "component", "name": "face" }` 引用了 `face` 组件。PRNG 会选择
`smile` 或 `neutral` 变体之一。

## 多个组件

你可以添加任意多个组件。每个组件彼此独立——PRNG 会分别为每个组件选择一个变体。

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

### 概率

`probability` 属性（0-100）控制组件出现的频率。
在上面的示例中，`accessories` 只会出现在大约 30% 的生成头像中。
默认值为 `100`（始终可见）。

### 变体权重

控制特定变体被选中的频率：

```json
{
  "variants": {
    "common": { "weight": 3, "elements": [...] },
    "uncommon": { "weight": 1, "elements": [...] },
    "rare": { "weight": 0, "elements": [...] }
  }
}
```

权重越高 = 被选中的可能性越大。只有当其他所有权重也都是 `0` 时，权重为 `0` 的项才会被选中。默认权重为 `1`。

### 组件变换

组件可以有默认的旋转、平移和缩放范围：

```json
{
  "eyes": {
    "width": 80,
    "height": 40,
    "rotate": [-5, 5],
    "scale": [0.95, 1.05],
    "translate": {
      "x": [-2, 2],
      "y": [-3, 3]
    },
    "variants": { ... }
  }
}
```

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

这些元数据会出现在：
- 生成的 SVG 内部的许可证注释中
- CLI 许可证横幅中
- 文档中（如果你的风格被添加到官方集合中）

## 模式验证

添加 `$schema` 属性以在你的编辑器中启用验证：

```json
{
  "$schema": "https://cdn.hopjs.net/npm/@dicebear/schema@0.9.0/dist/definition.min.json",
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
import { Avatar } from '@dicebear/core';
import definition from './my-style.json' with { type: 'json' };

const avatar = new Avatar(definition, { seed: 'test' });
console.log(avatar.toString());
```

### 使用 PHP 库

```php
use DiceBear\Avatar;

$definition = json_decode(file_get_contents('./my-style.json'), true);
$avatar = new Avatar($definition, ['seed' => 'test']);
echo (string) $avatar;
```

## 下一步

- 查看 [定义模式参考](/specification/definition-schema/) 以获取完整规范
- 浏览 [官方定义](https://github.com/dicebear/definitions) 以查看真实世界示例
- 使用 [Figma 插件](/guides/create-an-avatar-style-with-figma/) 进行可视化工作流
