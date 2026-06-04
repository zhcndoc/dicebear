---
layout: doc
title: WCAG 对比度拾色器 – 工具 | DiceBear
description: >
  基于 @dicebear/core 算法构建的交互式 WCAG 2.1 对比度拾色器。
  选择一种颜色，查看 DiceBear 会在两种对比度颜色中选择哪一种，
  并在画布上以等对比度边界的形式可视化展示。
aside: false
editLink: false
---

<script setup lang="ts">
import ContrastTool from "@theme/components/tools/ContrastTool.vue";
</script>

<ClientOnly>
  <ContrastTool />
</ClientOnly>
