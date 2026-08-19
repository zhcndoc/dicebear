---
title: Glyphs 预设 — 头像样式
description: >
  Glyphs 头像样式的现成选项集合。将预设复制到你的代码中，或在 DiceBear playground 中打开，然后继续调整。
aside: false
---

<script setup lang="ts">
import StylePresets from "@theme/components/styles/StylePresets.vue";
</script>

# Glyphs 预设

这里的每个预设都是一组普通的渲染选项。无需安装任何内容，同样的值可用于全部六个库，也可作为 HTTP-API 查询参数使用。选择一个预设来查看其代码，或在 playground 中打开并随意更改。

预设未设置的选项会随着 seed 继续变化，因此其中大多数仍会像普通样式一样，为每位用户生成独特的头像。每个预设都会列出它还能生成多少个不同的头像。

<StylePresets styleName="glyphs" large />
