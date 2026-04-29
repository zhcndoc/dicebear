---
title: 为库做贡献 | DiceBear
description: >
  了解如何为头像风格做贡献、改进现有风格，或参与 DiceBear 核心包的开发。
---

# 为库做贡献

DiceBear 在 GitHub 上由多个仓库共同维护。每个仓库都有自己的 `CONTRIBUTING.md`，其中包含设置、脚本、测试和发布说明。请选择与你想要参与的内容相匹配的仓库。

## 头像风格

新的头像风格以及现有风格的修复都位于 [`dicebear/definitions`](https://github.com/dicebear/definitions)。大多数风格都是在 Figma 中制作，并通过 [DiceBear Exporter](/guides/create-an-avatar-style-with-figma/) 插件导出，因此那里的工作流程并不是通常那种“编辑 JSON 文件”的循环。

- `dicebear/definitions` 中的 [`CONTRIBUTING.md`](https://github.com/dicebear/definitions/blob/main/CONTRIBUTING.md)

## 核心库、CLI、文档、编辑器

JavaScript 和 PHP 核心、CLI、VitePress 文档（包括 Playground）以及独立编辑器都位于主 [`dicebear/dicebear`](https://github.com/dicebear/dicebear) 单仓库中。请参见：

- `dicebear/dicebear` 中的 [`CONTRIBUTING.md`](https://github.com/dicebear/dicebear/blob/10.x/CONTRIBUTING.md)

其中涵盖了单仓库布局、按包的工作流程、`@dicebear/core` / `dicebear/core` 的跨语言一致性测试，以及发布流程。

## JSON Schema

头像风格定义和运行时选项的 schema 会单独进行版本管理，位于 [`dicebear/schema`](https://github.com/dicebear/schema)。

- `dicebear/schema` 中的 [`CONTRIBUTING.md`](https://github.com/dicebear/schema/blob/main/CONTRIBUTING.md)

## Figma 导出插件

用于生成新头像风格定义的 Figma 插件位于 [`dicebear/exporter-plugin-for-figma`](https://github.com/dicebear/exporter-plugin-for-figma)。

- `dicebear/exporter-plugin-for-figma` 中的 [`CONTRIBUTING.md`](https://github.com/dicebear/exporter-plugin-for-figma/blob/main/CONTRIBUTING.md)
