---
title: 使用 Figma 创建头像样式 | DiceBear
description: >
  使用 DiceBear Figma Exporter 插件创建自定义 DiceBear 头像样式的分步指南。
---

# 使用 Figma 创建头像样式

我们的 [Figma 插件](https://www.figma.com/community/plugin/1005765655729342787)
是为 DiceBear 创建头像样式的最简单方法。以下教程需要对 [Figma](https://www.figma.com/) 有基础了解。

## 第 1 步

如果你希望 DiceBear 动态更改头像中的颜色，你必须在 Figma 中将颜色创建为
[本地样式](https://help.figma.com/hc/en-us/articles/360039820134-Manage-and-share-styles)。
将颜色整理到[组](https://help.figma.com/hc/en-us/articles/360039820134-Manage-and-share-styles#Manage_styles)中。
按照以下格式命名：`<group>/<option-name>`。例如，`skin/light`。

稍后你将使用本地样式为路径着色。然后 DiceBear 会根据 seed 和颜色设置，改变同一组内路径的颜色。对于 `<group>` 和 `<option-name>` 的名称，你可以使用字母数字字符以及连字符。

在以下示例中，你可以看到它可能的样子：

<video src="/guides/create-an-avatar-style-with-figma/1.mp4" controls muted></video>

## 第 2 步

现在为你想要动态着色的路径分配一个来自已创建组的颜色。组中的具体颜色并不重要。重要的是组是正确的。

<video src="/guides/create-an-avatar-style-with-figma/2.mp4" controls muted></video>

## 第 3 步

将头像的各个独立部分创建为
[组件](https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma)。
同样，使用 `<group>/<option-name>` 命名模式来创建组。

与颜色类似，DiceBear 之后会（结合 seed 和设置）从某个组中选择一个组件并将其放入头像中。

<video src="/guides/create-an-avatar-style-with-figma/3.mp4" controls muted></video>

## 第 4 步

确保同一组中的每个组件具有相同的尺寸。

<video src="/guides/create-an-avatar-style-with-figma/4.mp4" controls muted></video>

## 第 5 步

创建任意数量的颜色组和组件组。然后你就可以把所有组件组合起来。

为此，
[创建一个画板](https://help.figma.com/hc/en-us/articles/360041539473-Frames-in-Figma)
并确保宽度和高度相同。从 Assets 选项卡中，将每个组件组中的一个实例拖入画板。

<video src="/guides/create-an-avatar-style-with-figma/5.mp4" controls muted></video>

## 第 6 步

现在搜索
[DiceBear Exporter](https://www.figma.com/community/plugin/1005765655729342787)
插件。确保你已选中画板并启动插件。

将会打开一个对话框，你可以在其中进行各种设置。例如头像样式的名称、许可证，或者组件在头像中后续出现的概率。

这些设置会自动保存到你的画板中。一旦你对设置满意，就可以导出你的头像样式。

<video src="/guides/create-an-avatar-style-with-figma/6.mp4" controls muted></video>

::: tip

请确保在导出设置中选择 **10.x** 版本。本指南适用于 10.x 版本。

![你可以在“通用”选项卡中找到版本选项](/guides/create-an-avatar-style-with-figma/version-hint.png)

:::

## 第 7 步

该插件会导出一个 JSON 文件——你的
[样式定义](/specification/definition-schema/)。这个文件可以立即使用。
无需构建步骤。

你可以立即使用 [CLI](/how-to-use/cli/) 测试你的样式：

```
dicebear ./your-style.json ./test-output --count 10
```

这会在 `./test-output` 目录中生成 10 个示例头像。

## 第 8 步

恭喜！你现在可以在
[JS Library](/how-to-use/js-library/)、[PHP Library](/how-to-use/php-library/) 或 [CLI](/how-to-use/cli/) 中使用你的头像样式了。

### 使用 JS Library

```js
import { Avatar } from '@dicebear/core';
import definition from './your-style.json' with { type: 'json' };

const avatar = new Avatar(definition, {
  seed: 'dicebear',
  // ... 其他选项
});
```

### 使用 PHP Library

```php
use DiceBear\Avatar;

$definition = json_decode(file_get_contents('./your-style.json'), true);

$avatar = new Avatar($definition, [
  'seed' => 'dicebear',
  // ... 其他选项
]);
```

### 使用 CLI

```
dicebear ./your-style.json ./avatars --seed "dicebear" --format png
```

::: tip

CLI 会自动检测你的样式定义中所有可用的选项。
使用你的定义文件配合 `--help` 查看它们：

```
dicebear ./your-style.json --help
```

:::
