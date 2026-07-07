---
title: Identicon – SVG Identicon API
description: >
  使用 DiceBear 生成确定性的 Identicon 头像，DiceBear 是一个免费的开源
  SVG identicon API 和头像库，可用于用户个人资料图片。
---

<script setup lang="ts">
import StylePreview from "@theme/components/styles/StylePreview.vue";
import StyleInfo from "@theme/components/styles/StyleInfo.vue";
import StyleDescription from "@theme/components/styles/StyleDescription.vue";
import StyleUsage from "@theme/components/styles/StyleUsage.vue";
import StyleOptions from "@theme/components/styles/StyleOptions.vue";
</script>

# Identicon

Identicon 以单色在带色调的背景上渲染对称的像素网格图案，这是一种经典的 identicon 风格，由开发者工具和版本控制托管平台所推广。每种图案都由其种子确定性生成，因此非常适合技术类个人资料图标和 identicon API 使用场景。

<StylePreview styleName="identicon" />

<StyleDescription styleName="identicon" />

## 什么是 identicon？

identicon 是一种由用户名、电子邮件或用户 ID 等值生成的小图像。相同的输入总是会生成相同的图片，因此人们可以一眼认出某个账户，而且没人需要上传照片。GitHub 将它们普及为默认头像，许多开发者工具也是如此。DiceBear 的 Identicon 风格也是这样工作的：它会对种子进行哈希处理并绘制一个对称网格，因此你可以把它用作个人资料图标和占位头像的 identicon 生成器。

## 用法

<StyleUsage styleName="identicon" />

## 选项

<StyleOptions styleName="identicon" />

## 详情

<StyleInfo styleName="identicon" />
