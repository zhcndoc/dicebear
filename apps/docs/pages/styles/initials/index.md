---
title: 首字母 – 头像占位 API
description: >
  使用 DiceBear（一款免费的头像占位 API 和 JavaScript 库）生成首字母 SVG 头像，
  用于用户个人资料图片。
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

# 首字母

首字母是一种基于文本的矢量头像样式，会在一个纯色方形背景中央渲染一到两个大字母，也就是你在许多应用中看到的字母组合头像或字母头像。它具有确定性且易于阅读，因此对于尚未上传头像的用户来说，是一个实用的备用方案，你可以根据任何名称或种子生成它。

<StylePreview styleName="initials" />

<StyleDescription styleName="initials" />

## 使用方法

<StyleUsage styleName="initials" />

## 预设

<StylePresets styleName="initials" :limit="5" />

## 选项

<StyleOptions styleName="initials" />

## 详情

<StyleInfo styleName="initials" />
