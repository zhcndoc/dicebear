---
title: Nuxt 头像库 – DiceBear 集成
description: >
  在 Nuxt 3 中使用 DiceBear SVG 头像。用于可确定性的个人资料图片的服务端渲染、
  客户端渲染以及 Nitro 端点模式。
---

# Nuxt 头像库：在 Nuxt 中使用 DiceBear

DiceBear 可与 Nuxt 的通用渲染模型协同工作。头像可以在 SSR 期间于服务器上生成，也可以在 Nitro 端点中生成，或者在普通客户端组件中生成。请选择与页面的
[渲染模式](https://nuxt.com/docs/guide/concepts/rendering)相匹配的方式。

你可以通过 [JS-Library](/how-to-use/js-library/) 或 [HTTP-API](/how-to-use/http-api/) 在 [Nuxt](https://nuxt.com/) 中使用 DiceBear。

## Using JS Libraries

### Common Components

Wrap the generation logic in `computed`, and the avatar will be generated at either end of the component render. Since the result is a data URI, the renderer will not run again when the markup is remounted on the client.

```vue
<!-- components/UserAvatar.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

const props = defineProps<{ seed?: string }>();

const avatar = computed(() =>
  new Avatar(style, {
    seed: props.seed ?? 'Alice',
    size: 128,
    // ... other options
  }).toDataUri(),
);
</script>

<template>
  <img :src="avatar" alt="Avatar" width="128" height="128" />
</template>
```

::: warning Hydration & `idRandomization`

`idRandomization` relies on the host's seedless RNG, so IDs generated during SSR will not match when the client re-renders, and Vue will report hydration mismatches. For SSR avatars, keep `idRandomization: false`; or wrap the component in `<ClientOnly>` and accept the visual flicker.

If you need unique IDs across multiple avatars on the same page, render the entire page on the server and skip client hydration for the avatar subtree.

:::

### Nitro Endpoint

When you need custom caching or seed validation, you can expose DiceBear through your own URL:

```ts
// server/api/avatar/[seed].get.ts
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

export default defineEventHandler((event) => {
  const seed = getRouterParam(event, 'seed') ?? '';

  setHeader(event, 'Content-Type', 'image/svg+xml');
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable');

  return new Avatar(style, { seed, size: 128 }).toString();
});
```

You can use it in any component via `<img :src="`/api/avatar/${seed}`">`.

### Using `useAsyncData` Cache

If you need per-request SSR caching (so that when multiple components request the same seed, rendering is not repeated), wrap the generation logic in `useAsyncData`:

```vue
<script setup lang="ts">
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

const props = defineProps<{ seed: string }>();

const { data: avatar } = await useAsyncData(`avatar:${props.seed}`, () =>
  Promise.resolve(
    new Avatar(style, { seed: props.seed, size: 128 }).toDataUri(),
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
