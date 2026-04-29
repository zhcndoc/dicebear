---
title: DiceBear – 开源头像库与 API
description: >
  DiceBear 是一个免费的开源头像库和头像 API。通过 JavaScript 库、PHP 库、HTTP API 或 CLI 生成确定性的 SVG 个人资料图片和用户占位图片。
---

<script setup>
import { Palette, Code2, Globe, Terminal, Server } from '@lucide/vue';
import DocsHighlights from '@theme/components/docs/DocsHighlights.vue';

const highlights = [
  {
    icon: Globe,
    title: 'HTTP API',
    description:
      '使用一个简单的 URL 即可在任何语言或平台中嵌入头像——无需安装。',
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
      '使用 PHP 8.2+ 在服务器上生成头像。与 JS 库拥有相同的 API——相同的 seed，相同的结果。',
    color: '#8b5cf6',
    link: '/how-to-use/php-library/',
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
    title: '设计器',
    description:
      '使用交互式编辑器浏览所有头像风格，自定义选项并导出头像——无需编写代码。',
    color: '#ec4899',
    link: 'https://editor.dicebear.com',
  },
];
</script>

# DiceBear – 开源头像库与 API

## 什么是 DiceBear？

使用 DiceBear，你可以在很短时间内为你的项目创建很棒的头像。
无论你是在寻找抽象图形，还是精心设计的角色，你
都能在我们的头像风格中找到合适的选择。无论你想如何以及
用于何处，DiceBear 都能提供合适的解决方案！

除了纯随机头像之外，你还可以为用户身份创建
[确定性](https://en.wikipedia.org/wiki/Deterministic_algorithm) 头像。
借助内置的 [PRNG](https://en.wikipedia.org/wiki/Pseudorandom_number_generator)，你可以根据 seed 一次又一次地生成相同的头像。
当然也可以创建个性化头像！只需使用每种头像风格提供的无数选项即可。

而且借助 [JavaScript 库](/how-to-use/js-library/)、
[PHP 库](/how-to-use/php-library/)、
[HTTP API](/how-to-use/http-api/)、
[CLI](/how-to-use/cli/)、
[Figma 插件](https://www.figma.com/community/plugin/1005765655729342787/DiceBear-Exporter)、
[编辑器](https://editor.dicebear.com) 和 [Playground](/playground/)，你的下一个
头像总是近在咫尺！探索我们的 [头像 API](/how-to-use/http-api/)，以便通过基于 URL 的方式轻松集成。

## 如何使用？

<DocsHighlights :highlights="highlights" />

## 它是如何工作的？

这些头像以 [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics) 格式创建。
这使得无需太多计算资源即可动态生成头像。在大多数情况下，
会从一组 SVG 元素中选择各种元素，例如头发、眼睛、耳朵等，并将它们组合起来创建一个角色 / 头像。

[FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function)
结合 [Mulberry32](https://gist.github.com/tommyettinger/46a874533244883189143505d203312c)
被用作 [PRNG](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) 的算法。
需要注意的是，PRNG **并不**试图做到
[密码学安全](https://en.wikipedia.org/wiki/Cryptographically-secure_pseudorandom_number_generator)。

## 隐私优先设计

DiceBear 的构建充分考虑了隐私。在使用
[JavaScript 库](/how-to-use/js-library/) 或
[PHP 库](/how-to-use/php-library/) 时，头像会完全在你的基础设施上生成——不会有任何个人数据离开你的系统。对于需要
完全控制数据保留和基础设施的团队，DiceBear 可以
[self-hosted](/guides/host-the-http-api-yourself/)——因此它是一个不依赖外部服务、注重隐私的头像解决方案。
