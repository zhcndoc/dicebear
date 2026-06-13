---
title: Vue 头像库 – DiceBear 集成
description: >
  通过 JavaScript 头像库或头像 API 将 DiceBear SVG 头像添加到 Vue 3 项目中。
  支持 TypeScript。
---

# Vue 头像库：在 Vue 中使用 DiceBear

DiceBear 与 Vue 的响应式模型配合得很好。将头像生成封装在
`computed` 属性中，以通过 JS 库实现完全控制，或通过 HTTP API 采用无依赖方式，
让个人资料图片与响应式数据保持同步。

你可以通过 [JS-Library](/how-to-use/js-library/) 或 [HTTP-API](/how-to-use/http-api/) 在 Vue 中使用 DiceBear。

## 使用 JS 库

```vue
<script setup>
import { computed } from 'vue';
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const props = defineProps({
  seed: { type: String, default: 'Alice' },
});

const avatar = computed(() =>
  new Avatar(lorelei, {
    seed: props.seed,
    size: 128,
    // ... 其他选项
  }).toDataUri(),
);
</script>

<template>
  <img :src="avatar" alt="头像" />
</template>
```

## 使用 HTTP API

```vue
<script setup>
import { computed } from 'vue';

const props = defineProps({
  seed: { type: String, default: 'Alice' },
});

const src = computed(() => {
  const url = new URL('https://api.dicebear.com/10.x/lorelei/svg');
  url.searchParams.set('seed', props.seed);
  url.searchParams.set('size', '128');
  // ... 其他选项
  return url.href;
});
</script>

<template>
  <img :src="src" alt="头像" />
</template>
```
