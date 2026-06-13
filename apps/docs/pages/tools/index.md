---
layout: page
title: 工具 – 用于处理 DiceBear 头像的实用工具 | DiceBear
description: >
  帮助你理解 DiceBear 如何处理颜色、对比度和头像生成的交互式工具，基于与库本身相同的算法构建。
aside: false
sidebar: false
---

<script setup lang="ts">
import ToolList from "@theme/components/tools/ToolList.vue";
import { UiContainer, UiHeadline, UiDescription } from "@theme/components/ui";
</script>

<UiContainer size="sm" class="tools-page">
  <div class="tools-hero">
    <UiHeadline tag="h1" class="tools-title">
      <strong>工具</strong> 概览
    </UiHeadline>
    <UiDescription>
      用于处理 DiceBear 头像的小型、专注型实用工具。每个工具都使用与 <code>@dicebear/core</code> 库相同的算法，因此这里看到的结果与你生成的头像效果一致。
    </UiDescription>
  </div>

  <ToolList />
</UiContainer>

<style>
.tools-page .tools-hero {
  text-align: center;
  padding: 80px 0 48px;
}
.tools-page code {
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: var(--vp-radius-xs);
  font-size: 0.9em;
}
</style>
