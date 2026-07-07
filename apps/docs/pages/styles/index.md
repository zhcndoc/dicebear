---
layout: page
title: 头像风格 – 浏览 35+ 种头像设计
description: >
  浏览 DiceBear 头像库中的 35+ 种风格并生成头像。从抽象图案到角色设计：适用于个人资料图片和用户头像的完美头像生成器。
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
      浏览我们的头像库，从抽象图案到手工打造的角色插画。每种风格都由艺术家制作，可直接用于您的项目中的个人资料图片。
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
