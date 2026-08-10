---
title: Identicon – SVG Identicon API
description: >
  使用 DiceBear 生成确定性的 Identicon 头像。DiceBear 是一个免费、开源的
  SVG Identicon API 和头像库，适用于用户个人资料图片。
outline: [2, 3]
---

<script setup lang="ts">
import StylePreview from "@theme/components/styles/StylePreview.vue";
import StyleInfo from "@theme/components/styles/StyleInfo.vue";
import StyleDescription from "@theme/components/styles/StyleDescription.vue";
import StyleUsage from "@theme/components/styles/StyleUsage.vue";
import StyleOptions from "@theme/components/styles/StyleOptions.vue";
</script>

# Identicon

Identicon 会在带色调的背景上，以单一颜色呈现对称的像素网格图案，这种经典的
Identicon 外观因开发者工具和版本控制托管平台而广为人知。每种图案都根据其种子
确定性地生成，因此非常适合技术类个人资料图标和 Identicon API 使用场景。

<StylePreview styleName="identicon" />

<StyleDescription styleName="identicon" />

## 什么是 identicon？

Identicon 是根据用户名、电子邮件或用户 ID 等值生成的小型图像。同一个输入始终会生成相同的图片，因此人们可以一眼认出某个账户，也不必上传照片。GitHub 将其作为默认头像而广为人知，许多开发者工具也采用了相同的做法。DiceBear 的 Identicon 样式同样如此：它会对种子值进行哈希处理并绘制对称网格，因此你可以将其用作个人资料图标和占位头像的 identicon 生成器。

## 用法

<StyleUsage styleName="identicon" />

## 选项

<StyleOptions styleName="identicon" />

## 详情

<StyleInfo styleName="identicon" />
