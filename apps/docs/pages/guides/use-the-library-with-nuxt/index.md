---
title: Nuxt 头像库 – DiceBear 集成
description: >
  在 Nuxt 3 中使用 DiceBear SVG 头像。用于可确定性的个人资料图片的服务端渲染、
  客户端渲染以及 Nitro 端点模式。
---

# Nuxt 头像库 – 在 Nuxt 中使用 DiceBear

DiceBear 自然地适配 Nuxt 的通用渲染模型。头像可以在 SSR 期间于服务端生成，也可以在 Nitro 端点中生成，或者在普通的客户端组件中生成——选择最符合页面
[渲染模式](https://nuxt.com/docs/guide/concepts/rendering) 的方式即可。

你可以通过 [JS-Library](/how-to-use/js-library/) 或 [HTTP-API](/how-to-use/http-api/) 在 [Nuxt](https://nuxt.com/) 中使用 DiceBear。

## 使用 JS 库

### 通用组件

将生成逻辑包装在 `computed` 中，头像就会在组件渲染的任一端生成。由于结果是 data URI，标记在客户端重新挂载时不会再次运行渲染器。

```vue
<!-- components/UserAvatar.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const props = defineProps<{ seed?: string }>();

const avatar = computed(() =>
  new Avatar(lorelei, {
    seed: props.seed ?? 'Alice',
    size: 128,
    // ... 其他选项
  }).toDataUri(),
);
</script>

<template>
  <img :src="avatar" alt="头像" width="128" height="128" />
</template>
```

::: warning Hydration & `idRandomization`

`idRandomization` 依赖宿主环境未设种子的随机数生成器，因此 SSR 期间生成的 ID 与客户端重新渲染时不会匹配——Vue 会记录 hydration 不匹配警告。对于 SSR 的头像，请保持 `idRandomization: false`；或者将组件包裹在 `<ClientOnly>` 中，并接受可见的闪烁。

如果你需要在同一页面上的多个头像之间保持唯一 ID，请在服务端渲染整个页面，并跳过头像子树的客户端 hydration。

:::

### Nitro 端点

当你需要自定义缓存或 seed 校验时，可以通过自己的 URL 暴露 DiceBear：

```ts
// server/api/avatar/[seed].get.ts
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

export default defineEventHandler((event) => {
  const seed = getRouterParam(event, 'seed') ?? '';

  setHeader(event, 'Content-Type', 'image/svg+xml');
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable');

  return new Avatar(lorelei, { seed, size: 128 }).toString();
});
```

在任何组件中都可以通过 `<img :src="`/api/avatar/${seed}`">` 来使用它。

### 使用 `useAsyncData` 缓存

如果你需要按请求进行 SSR 缓存（这样当多个组件请求同一个 seed 时，就不会重复渲染），请将生成逻辑包装在 `useAsyncData` 中：

```vue
<script setup lang="ts">
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const props = defineProps<{ seed: string }>();

const { data: avatar } = await useAsyncData(`avatar:${props.seed}`, () =>
  Promise.resolve(
    new Avatar(lorelei, { seed: props.seed, size: 128 }).toDataUri(),
  ),
);
</script>

<template>
  <img :src="avatar ?? undefined" alt="头像" width="128" height="128" />
</template>
```

## 使用 HTTP API

HTTP API 无需安装。服务端和浏览器中的 URL 是相同的，因此 `<img>` 在任何渲染模式下都可以正常工作：

```vue
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ seed?: string }>();

const src = computed(() => {
  const url = new URL('https://api.dicebear.com/10.x/lorelei/svg');
  url.searchParams.set('seed', props.seed ?? 'Alice');
  url.searchParams.set('size', '128');
  return url.href;
});
</script>

<template>
  <img :src="src" alt="头像" width="128" height="128" />
</template>
```
