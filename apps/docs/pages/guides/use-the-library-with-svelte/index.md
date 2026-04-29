---
title: Svelte 头像库 – DiceBear 集成
description: >
  在 Svelte 中通过 JavaScript 头像库或头像 API 使用 DiceBear 生成 SVG 个人资料图片。
---

# Svelte 头像库 – 在 Svelte 中使用 DiceBear

DiceBear 可同时用于 Svelte 4 和 Svelte 5。使用 `$derived`（Svelte 5）或
响应式语句（Svelte 4）让 SVG 个人资料图片与属性
变化保持同步——可通过 JS 库在客户端生成，或使用 HTTP API 采用
零依赖方案。

你可以通过
[JS-Library](/how-to-use/js-library/) 或
[HTTP-API](/how-to-use/http-api/)
在 Svelte 中使用 DiceBear。

## 使用 JS 库

::: code-group

```svelte [Svelte 5]
<script>
  import { Avatar } from '@dicebear/core';
  import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

  let { seed = 'John Doe' } = $props();

  const avatar = $derived(
    new Avatar(lorelei, {
      seed,
      size: 128,
      // ... 其他选项
    }).toDataUri()
  );
</script>

<img src={avatar} alt="头像" />
```

```svelte [Svelte 4]
<script>
  import { Avatar } from '@dicebear/core';
  import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

  export let seed = 'John Doe';

  $: avatar = new Avatar(lorelei, {
    seed,
    size: 128,
    // ... 其他选项
  }).toDataUri();
</script>

<img src={avatar} alt="头像" />
```

:::

## 使用 HTTP API

::: code-group

```svelte [Svelte 5]
<script>
  let { seed = 'John Doe' } = $props();

  const src = $derived.by(() => {
    const url = new URL('https://api.dicebear.com/10.x/lorelei/svg');
    url.searchParams.set('seed', seed);
    url.searchParams.set('size', '128');
    // ... 其他选项
    return url.href;
  });
</script>

<img src={src} alt="头像" />
```

```svelte [Svelte 4]
<script>
  export let seed = 'John Doe';

  let src = '';

  $: {
    const url = new URL('https://api.dicebear.com/10.x/lorelei/svg');
    url.searchParams.set('seed', seed);
    url.searchParams.set('size', '128');
    // ... 其他选项
    src = url.href;
  }
</script>

<img src={src} alt="头像" />
```

:::
