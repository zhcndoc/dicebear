---
title: Glass 预设 – 头像样式
description: >
  Glass 头像样式的现成选项集。将预设复制到你的代码中，或在 DiceBear playground 中打开它，然后继续进行调整。
aside: false
---

<script setup lang="ts">
import StylePresets from "@theme/components/styles/StylePresets.vue";
</script>

# Glass 预设

这里的每个预设都是一组普通的渲染选项。无需安装任何内容，相同的值可在全部六个库中使用，也可作为 HTTP-API 查询参数使用。选择一个预设来查看其代码，或在 playground 中打开它并随意修改。

预设未设置的选项会随 seed 继续变化，因此其中大多数预设都能像普通样式一样，为每位用户保留独特性。每个预设都会列出它仍可生成多少个不同的头像。

<StylePresets styleName="glass" large />
