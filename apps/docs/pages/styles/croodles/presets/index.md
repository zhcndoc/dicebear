---
title: Croodles 预设 — 头像样式
description: >
  Croodles 头像样式的现成选项集。将预设复制到你的代码中，或在 DiceBear playground 中打开它，并从那里继续调整。
aside: false
---

<script setup lang="ts">
import StylePresets from "@theme/components/styles/StylePresets.vue";
</script>

# Croodles 预设

这里的每个预设都是一组普通的渲染选项。无需安装任何东西，相同的值可在全部六个库中使用，也可作为 HTTP-API 查询参数使用。选择一个预设来查看其代码，或在 playground 中打开它并随意修改。

预设未设置的选项会继续随 seed 变化，因此其中大多数仍会像普通样式一样为每位用户保持独特。每个预设都会列出它还能生成多少个不同的头像。

<StylePresets styleName="croodles" large />
