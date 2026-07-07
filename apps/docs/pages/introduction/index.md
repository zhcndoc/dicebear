---
title: DiceBear – 开源头像库与 API
description: >
  DiceBear 是一个免费的开源头像库和头像 API。通过 JavaScript
  库、PHP 库、Python 库、Rust 库、Go 库、Dart 库、HTTP API 或 CLI，
  生成确定性的 SVG 个人资料图片和用户占位图片。
---

<script setup>
import { Palette, Code2, Globe, Terminal, Server, Library, Boxes, Hexagon, Target } from '@lucide/vue';
import DocsHighlights from '@theme/components/docs/DocsHighlights.vue';

const highlights = [
  {
    icon: Globe,
    title: 'HTTP API',
    description:
      '使用一个简单的 URL 即可在任何语言或平台中嵌入头像，而无需安装任何东西。',
    color: '#22c55e',
    link: '/how-to-use/http-api/',
  },
  {
    icon: Code2,
    title: 'JS 库',
    description:
      '在浏览器或 Node.js 中生成头像，完整支持 TypeScript。非常适合 React、Vue、Svelte 等。',
    color: '#1689cc',
    link: '/how-to-use/js-library/',
  },
  {
    icon: Server,
    title: 'PHP 库',
    description:
      '使用 PHP 8.2+ 在服务器上生成头像。与 JS 库的 API 完全一致：相同的 seed，相同的结果。',
    color: '#8b5cf6',
    link: '/how-to-use/php-library/',
  },
  {
    icon: Library,
    title: 'Python 库',
    description:
      '使用 Python 3.10+ 在服务器上生成头像。与 JS 库的 API 完全一致：相同的 seed，相同的结果。',
    color: '#3b82f6',
    link: '/how-to-use/python-library/',
  },
  {
    icon: Boxes,
    title: 'Rust 库',
    description:
      '使用 Rust 1.80+ 在服务器上生成头像。与 JS 库的 API 完全一致：相同的 seed，相同的结果。',
    color: '#14b8a6',
    link: '/how-to-use/rust-library/',
  },
  {
    icon: Hexagon,
    title: 'Go 库',
    description:
      '使用 Go 1.23+ 在服务器上生成头像。与 JS 库的 API 完全一致：相同的 seed，相同的结果。',
    color: '#00add8',
    link: '/how-to-use/go-library/',
  },
  {
    icon: Target,
    title: 'Dart 库',
    description:
      '使用 Dart 3.4+ 在 Dart 和 Flutter 应用中生成头像。与 JS 库的 API 完全一致：相同的 seed，相同的结果。',
    color: '#0175c2',
    link: '/how-to-use/dart-library/',
  },
  {
    icon: Terminal,
    title: 'CLI',
    description:
      '非常适合从命令行直接进行多种图片格式的自动化和批量导出。',
    color: '#f59e0b',
    link: '/how-to-use/cli/',
  },
  {
    icon: Palette,
    title: '编辑器',
    description:
      '使用交互式编辑器浏览所有头像风格，自定义选项，并且无需编写任何代码即可导出头像。',
    color: '#ec4899',
    link: 'https://editor.dicebear.com',
  },
];
</script>

# DiceBear: 开源头像库与 API

## 什么是 DiceBear？

DiceBear 为你的项目生成头像。头像风格涵盖了多种外观，从抽象图形到设计角色，这些头像可用于多种类型的应用程序。

除了纯随机头像之外，你还可以为用户身份创建[确定性](https://en.wikipedia.org/wiki/Deterministic_algorithm)头像。借助内置的[PRNG](https://en.wikipedia.org/wiki/Pseudorandom_number_generator)，你可以基于一个种子一次又一次生成相同的头像。你也可以进行个性化调整：每种头像风格都提供了许多选项来微调结果。

DiceBear 可通过 [JavaScript 库](/how-to-use/js-library/)、[PHP 库](/how-to-use/php-library/)、[Python 库](/how-to-use/python-library/)、[Rust 库](/how-to-use/rust-library/)、[Go 库](/how-to-use/go-library/)、[Dart 库](/how-to-use/dart-library/)、[HTTP API](/how-to-use/http-api/)、[CLI](/how-to-use/cli/)、[Figma 插件](https://www.figma.com/community/plugin/1005765655729342787/DiceBear-Exporter)、[编辑器](https://editor.dicebear.com) 和 [Playground](/playground/) 使用，因此你可以将其集成到大多数项目中。[头像 API](/how-to-use/http-api/) 提供基于 URL 的集成方式，无需安装任何东西。

## 如何使用？

<DocsHighlights :highlights="highlights" />

## 它是如何工作的？

这些头像以 [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics) 格式创建。
这使得无需太多计算资源即可动态生成头像。在大多数情况下，
会从一组 SVG 元素中选择各种元素，例如头发、眼睛、耳朵等，并将它们组合起来创建一个角色 / 头像。

[FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function)
结合
[Mulberry32](https://gist.github.com/tommyettinger/46a874533244883189143505d203312c)
被用作
[PRNG](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) 的算法。该 PRNG
**不会**尝试成为
[加密安全的](https://en.wikipedia.org/wiki/Cryptographically-secure_pseudorandom_number_generator)。

## 设计即隐私

DiceBear 在构建时就将隐私放在首位。使用
[JavaScript 库](/how-to-use/js-library/),
[PHP 库](/how-to-use/php-library/),
[Python 库](/how-to-use/python-library/),
[Rust 库](/how-to-use/rust-library/), [Go 库](/how-to-use/go-library/)
或 [Dart 库](/how-to-use/dart-library/) 时，头像完全在您的基础设施上生成。任何个人数据都不会离开您的系统。对于需要对数据保留和基础设施进行完全控制的团队，DiceBear 可以进行
[自托管](/guides/host-the-http-api-yourself/)，因此无需依赖外部服务。
