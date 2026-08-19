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
import { UiContainer } from "@theme/components/ui";
</script>

<UiContainer class="styles-page">
  <h1 class="sr-only">头像风格</h1>
  <StyleList />
</UiContainer>
