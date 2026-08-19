---
title: Patchwork – 头像样式
description: >
  使用 DiceBear 头像库创建 Patchwork 头像。通过我们的免费头像 API 或 JavaScript 头像库生成独特的个人资料图片。
outline: [2, 3]
---

<script setup lang="ts">
import StylePreview from "@theme/components/styles/StylePreview.vue";
import StyleInfo from "@theme/components/styles/StyleInfo.vue";
import StyleDescription from "@theme/components/styles/StyleDescription.vue";
import StyleUsage from "@theme/components/styles/StyleUsage.vue";
import StylePresets from "@theme/components/styles/StylePresets.vue";
import StyleOptions from "@theme/components/styles/StyleOptions.vue";
</script>

# Patchwork

Patchwork 使用传统的拼布图案制作被子，例如风车、飞鹅和栅栏。每个头像会从十八种图案中选取两种，并将它们旋转 180 度后作为对角孪生图案重复排列，因此每条拼布被子最终都会呈现中心对称。为用户账户和占位符生成纺织品风格的抽象头像。

<StylePreview styleName="patchwork" />

<StyleDescription styleName="patchwork" />

## 用法

<StyleUsage styleName="patchwork" />

## 预设

<StylePresets styleName="patchwork" :limit="5" />

## 选项

<StyleOptions styleName="patchwork" />

## 详细信息

<StyleInfo styleName="patchwork" />
