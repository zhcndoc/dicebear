---
title: Bottts 预设——头像样式
description: >
  Bottts 头像样式的现成选项集。将预设复制到代码中，或在 DiceBear playground
  中打开，然后继续调整。
aside: false
---

<script setup lang="ts">
import StylePresets from "@theme/components/styles/StylePresets.vue";
</script>

# Bottts 预设

这里的每个预设都是一组普通的渲染选项。无需安装任何内容，相同的值可用于全部六个库，也可作为 HTTP-API 查询参数使用。选择一个预设来查看其代码，或在 playground 中打开它并随意修改。

预设未设置的选项会继续随 seed 变化，因此其中大多数预设仍能像普通样式一样，为每位用户生成独特的头像。每个预设都会列出它还能生成多少个不同的头像。

<StylePresets styleName="bottts" large />
