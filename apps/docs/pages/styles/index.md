---
layout: page
title: 头像风格 – 浏览 30+ 款头像设计 | DiceBear
description: >
  浏览 30+ 款风格，并使用 DiceBear 头像库生成头像。从
  抽象图案到角色设计——适合个人资料图片和用户头像的完美头像生成器。
aside: false
sidebar: false
---

<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import StyleList from "@theme/components/styles/StyleList.vue";
import { UiContainer, UiHeadline, UiDescription } from "@theme/components/ui";

const { theme } = useData();
const styleCount = computed(() => Object.keys(theme.value.avatarStyles).length);
</script>

<UiContainer class="styles-page">
  <div class="styles-hero">
    <UiHeadline tag="h1" class="styles-title">
      <strong>风格</strong> 概览
    </UiHeadline>
    <UiDescription>
      浏览我们的头像库——从抽象图案到精心设计的角色。每种风格都由才华横溢的艺术家精心打造，可直接用作您项目中的个人资料图片。
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
