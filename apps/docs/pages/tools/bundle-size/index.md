---
layout: page
title: 包大小估算器 – 工具
description: >
  选择你计划使用的 DiceBear 样式，查看它们将为你的 JavaScript 包增加多少
  压缩并经过 gzip 的千字节数。
aside: false
editLink: false
---

<script setup lang="ts">
import BundleSizeTool from "@theme/components/tools/BundleSizeTool.vue";
</script>

<ClientOnly>
  <BundleSizeTool />
</ClientOnly>
