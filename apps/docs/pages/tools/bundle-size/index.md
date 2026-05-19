---
layout: page
title: Bundle Size Estimator – Tools | DiceBear
description: >
  See how much each DiceBear style adds to your bundle. Raw and gzipped sizes
  taken straight from the installed @dicebear/styles package.
aside: false
sidebar: false
---

<script setup lang="ts">
import BundleSizeTool from "@theme/components/tools/BundleSizeTool.vue";
</script>

<ClientOnly>
  <BundleSizeTool />
</ClientOnly>
