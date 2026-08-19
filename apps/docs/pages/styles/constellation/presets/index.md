---
title: Constellation 预设 – 头像样式
description: >
  Constellation 头像样式的现成选项集。将预设复制到你的代码中，或在 DiceBear playground 中打开，然后继续从那里进行调整。
aside: false
---

<script setup lang="ts">
import StylePresets from "@theme/components/styles/StylePresets.vue";
</script>

# Constellation 预设

这里的每个预设都是一组普通的渲染选项。无需安装任何内容，这些值在全部六个库中以及作为 HTTP-API 查询参数时都可以正常使用。选择一个来查看其代码，或在 playground 中打开它，然后随意更改。

预设未设置的选项会继续随 seed 变化，因此其中大多数仍会像普通样式一样为每位用户保持独特。每个预设都会列出它仍能生成多少个不同的头像。

<StylePresets styleName="constellation" large />
