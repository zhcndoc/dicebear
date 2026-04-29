---
title: CLI – 从命令行生成头像 | DiceBear
description: >
  使用 DiceBear CLI 批量生成头像。免费的命令行头像生成器，用于创建个人资料图片和用户占位图像。支持所有样式。
---

# CLI

使用 CLI，你可以在极短时间内创建成千上万个头像！

## 安装

请确保已安装 [Node.js](https://nodejs.org/en/)（版本 22 或更高）以及
npm。

```
npm install dicebear --global
```

## 升级

为了获得最新功能和头像样式，请确保定期更新 CLI。

```
npm install dicebear --global
```

## 用法

### 创建一个头像

将 `<style>` 替换为头像样式名称（camelCase），并将 `[outputPath]` 替换为
目标目录。如果省略 `[outputPath]`，则使用当前目录作为目标目录。

```
dicebear <style> [outputPath]
```

例如，要使用 [lorelei](/styles/lorelei/) 头像样式创建头像，请使用以下命令：

```
dicebear lorelei ./avatars
```

头像将保存为 `lorelei-0.svg`，位于 `./avatars` 目录中。

:::info

我们提供了来自不同艺术家的大量头像样式。这些头像样式采用不同的许可证，
由艺术家自行选择。为了便于快速了解，我们为你创建了一个
[许可证概览](/licenses/)。

:::

### 创建多个头像

你也可以一次创建多个头像！只需使用 `--count` 选项。
将 `<count>` 替换为要创建的头像数量。

```
dicebear <style> [outputPath] --count <count>
```

例如，创建 100 个头像：

```
dicebear lorelei ./avatars --count 100
```

这将生成名为 `lorelei-0.svg`、`lorelei-1.svg`、...、
`lorelei-99.svg` 的文件。

:::warning

`seed` 选项与 `count` 选项一起使用时不会生效。如果
`count` 大于 `1`，系统会生成随机值并将其用作 `seed`，
以使头像彼此不同。

:::

:::tip 性能

CLI 会基于你的 CPU 核心数使用并行处理。生成大批量头像时已针对性能进行了优化。

:::

### 输出格式

你可以使用 `--format` 选项创建多种格式的头像：

| 格式 | 描述                           |
| ---- | ------------------------------ |
| `svg`  | 可缩放矢量图形（默认）         |
| `png`  | PNG 图像                        |
| `jpg`  | JPEG 图像                       |
| `jpeg` | JPEG 图像（jpg 的别名）         |
| `webp` | WebP 图像                       |
| `avif` | AVIF 图像                       |
| `json` | 包含头像元数据的 JSON           |

示例：

```
dicebear lorelei ./avatars --format png
```

#### 控制输出图像大小

`--size` 用于控制所有格式的输出尺寸（宽度和高度，单位为像素）。默认值为 `512`。对于光栅格式（PNG、JPEG、WebP、AVIF），
其值上限为 `2048`。

```
dicebear lorelei ./avatars --format png --size 256
```

#### 添加 Exif 元数据

在创建 PNG、JPEG、WebP 或 AVIF 图像时，你可以包含 Exif 元数据：

```
dicebear lorelei ./avatars --format png --exif
```

#### 将 JSON 与图像一并保存

你可以为每张图像旁边保存一个包含头像元数据的 JSON 文件：

```
dicebear lorelei ./avatars --format png --json
```

这会为每个头像同时创建 `lorelei-0.png` 和 `lorelei-0.json`。

### 传递样式选项

每种头像样式都有自己的自定义选项。要查看特定样式的所有可用
选项，请使用 `--help`：

```
dicebear lorelei --help
```

示例输出：

```
dicebear lorelei [outputPath]

生成 "lorelei" 头像

选项:
      --version            显示版本号                                 [boolean]
      --help               显示帮助                                   [boolean]
      --count              定义要创建的头像数量。                      [number]
      --format                [string] [choices: "svg", "png", "jpg", ...]
      --exif               包含 Exif 元数据                            [boolean]
      --json               除图像文件外还保存 JSON 文件                 [boolean]
      --seed                                                            [string]
      --flip                                                            [string]
      --rotate                                                          [number]
      --scale                                                           [number]
      --borderRadius                                                    [number]
      --size                                                            [number]
      --backgroundColor                                                  [array]
      --translateX                                                      [number]
      --translateY                                                      [number]
      --idRandomization                                                [boolean]
      --title                                                           [string]
      --fontFamily                                                      [string]
      --fontWeight                                                      [number]
      ... （样式特定选项）
```

带选项的示例：

```
dicebear lorelei ./avatars --backgroundColor b6e3f4,c0aede,d1d4f9 --size 128
```

### 输出文件命名

文件命名遵循以下模式：`{style}-{index}.{format}`：

- `lorelei-0.svg`
- `lorelei-1.png`
- `avataaars-0.webp`

索引从 0 开始，并在每创建一个头像后递增。

:::warning 文件覆盖保护

CLI **不会** 覆盖现有文件。如果目标路径下已存在文件，将抛出错误。请确保使用空目录，或者在生成新头像之前删除现有文件。

:::

### 许可证横幅

在生成头像之前，CLI 会显示一个许可证横幅，其中包含样式创作者和许可证的信息：

```
----------------------------------------------------------------
Lorelei by Lisa Wischofsky
Homepage: https://www.instagram.com/lischi_art/
Source: https://www.figma.com/community/file/1198749693280469639
License: CC0 1.0 - https://creativecommons.org/publicdomain/zero/1.0/
----------------------------------------------------------------
```

### 显示帮助

获取常规帮助和所有可用样式列表：

```
dicebear --help
```

```
dicebear <command>

Commands:
  dicebear adventurer [outputPath]         生成 "adventurer" 头像
  dicebear adventurerNeutral [outputPath]  生成 "adventurerNeutral" 头像
  dicebear avataaars [outputPath]          生成 "avataaars" 头像
  dicebear avataaarsNeutral [outputPath]   生成 "avataaarsNeutral" 头像
  dicebear bigEars [outputPath]            生成 "bigEars" 头像
  dicebear bigEarsNeutral [outputPath]     生成 "bigEarsNeutral" 头像
  dicebear bigSmile [outputPath]           生成 "bigSmile" 头像
  dicebear bottts [outputPath]             生成 "bottts" 头像
  dicebear botttsNeutral [outputPath]      生成 "botttsNeutral" 头像
  dicebear croodles [outputPath]           生成 "croodles" 头像
  dicebear croodlesNeutral [outputPath]    生成 "croodlesNeutral" 头像
  dicebear dylan [outputPath]              生成 "dylan" 头像
  dicebear funEmoji [outputPath]           生成 "funEmoji" 头像
  dicebear glass [outputPath]              生成 "glass" 头像
  dicebear icons [outputPath]              生成 "icons" 头像
  dicebear identicon [outputPath]          生成 "identicon" 头像
  dicebear initials [outputPath]           生成 "initials" 头像
  dicebear lorelei [outputPath]            生成 "lorelei" 头像
  dicebear loreleiNeutral [outputPath]     生成 "loreleiNeutral" 头像
  dicebear micah [outputPath]              生成 "micah" 头像
  dicebear miniavs [outputPath]            生成 "miniavs" 头像
  dicebear notionists [outputPath]         生成 "notionists" 头像
  dicebear notionistsNeutral [outputPath]  生成 "notionistsNeutral" 头像
  dicebear openPeeps [outputPath]          生成 "openPeeps" 头像
  dicebear personas [outputPath]           生成 "personas" 头像
  dicebear pixelArt [outputPath]           生成 "pixelArt" 头像
  dicebear pixelArtNeutral [outputPath]    生成 "pixelArtNeutral" 头像
  dicebear rings [outputPath]              生成 "rings" 头像
  dicebear shapes [outputPath]             生成 "shapes" 头像
  dicebear thumbs [outputPath]             生成 "thumbs" 头像
  dicebear toonHead [outputPath]           生成 "toonHead" 头像

Options:
  --version  显示版本号                                            [boolean]
  --help     显示帮助                                               [boolean]
```

## 自定义样式

你可以将任何 JSON [定义文件](/specification/definition-schema/) 作为
样式使用——包括你自己的自定义样式，或从 [Figma 插件](/guides/create-an-avatar-style-with-figma/) 导出的样式。

只需传入 JSON 文件路径，而不是样式名称：

```
dicebear ./my-style.json ./avatars
```

所有可用选项都会根据定义自动检测。使用
`--help` 查看它们：

```
dicebear ./my-style.json --help
```

生成 PNG 格式的多个头像：

```
dicebear ./my-style.json ./avatars --count 20 --format png
```

## 示例

### 使用特定 seed 生成单个头像

```
dicebear avataaars ./avatars --seed "john-doe"
```

### 生成 50 个带自定义背景的 PNG 头像

```
dicebear bottts ./avatars --count 50 --format png --backgroundColor b6e3f4
```

### 生成带 JSON 元数据的头像

```
dicebear pixelArt ./avatars --count 10 --format webp --json
```

### 生成 initials 头像

```
dicebear initials ./avatars --seed "John Doe"
```

## 故障排除

### “File already exists” 错误

CLI 不会覆盖现有文件。你可以：

- 使用空的输出目录
- 在重新生成之前删除现有文件

### 未找到头像样式

请确保你使用的是正确的 camelCase 样式名称。运行 `dicebear --help`
查看所有可用样式。

### 权限被拒绝

请确保你对输出目录拥有写入权限。在 Unix 系统上，
你可能需要调整目录权限，或者在全局安装时使用 `sudo`。
