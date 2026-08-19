---
title: Thumbs 预设 – Avatar 风格
description: >
  Thumbs Avatar 风格的现成选项集。将预设复制到代码中，或在 DiceBear playground 中打开，然后继续进行调整。
aside: false
---

<script setup lang="ts">
import StylePresets from "@theme/components/styles/StylePresets.vue";
</script>

# Thumbs 预设

这里的每个预设都是一组普通的渲染选项。无需安装任何内容，相同的值可在全部六个库中使用，也可作为 HTTP-API 查询参数使用。选择一个预设以阅读其代码，或在 playground 中打开并随意修改。

预设未设置的选项会继续随 seed 变化，因此其中大多数预设仍能像普通样式一样为每位用户生成独特头像。每个预设都会列出它还能生成多少个不同的头像。

<StylePresets styleName="thumbs" large />
