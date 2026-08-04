---
layout: page
title: 头像风格 – 浏览 %STYLE_COUNT% 种头像设计
description: >
  浏览 %STYLE_COUNT% 种风格，并使用 DiceBear 头像库生成头像。从抽象图案到角色设计：为个人资料图片和用户头像打造的完美头像生成器。
aside: false
sidebar: false
---

<script setup lang="ts">
import StyleList from "@theme/components/styles/StyleList.vue";
import { UiContainer, UiHeadline, UiDescription } from "@theme/components/ui";
</script>

<UiContainer class="styles-page">
  <div class="styles-hero">
    <UiHeadline tag="h1" class="styles-title">
      <strong>风格</strong> 概览
    </UiHeadline>
    <UiDescription>
      浏览我们的头像库，从抽象图案到手绘角色插画，应有尽有。有些风格来自独立艺术家，有些则是我们自行设计的。所有风格都可以直接用作项目中的个人资料图片。
    </UiDescription>
  </div>

  <StyleList />
</UiContainer>

<style>
.styles-page .styles-hero {
  text-align: center;
  padding: 80px 0 48px;
}
</style>
