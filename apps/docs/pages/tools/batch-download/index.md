---
layout: page
title: Batch Download – Tools | DiceBear
description: >
  Paste a list of seeds and download a ZIP of generated DiceBear avatars.
  Useful for migrating styles or snapshotting current avatars before changes.
aside: false
sidebar: false
---

<script setup lang="ts">
import BatchDownloadTool from "@theme/components/tools/BatchDownloadTool.vue";
</script>

<ClientOnly>
  <BatchDownloadTool />
</ClientOnly>
