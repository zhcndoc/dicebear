---
title: Svelte Avatar Library – DiceBear Integration
description: >
  Use DiceBear to generate SVG profile pictures in Svelte via the JavaScript
  avatar library or avatar API.
---

# Svelte Avatar Library – Using DiceBear with Svelte

DiceBear works with both Svelte 4 and Svelte 5. Use `$derived` (Svelte 5) or
reactive statements (Svelte 4) to keep SVG profile pictures in sync with prop
changes — via the JS library for client-side generation or the HTTP API for a
zero-dependency approach.

You can use DiceBear with Svelte either via the
[JS-Library](/how-to-use/js-library/) or the
[HTTP-API](/how-to-use/http-api/).

## With the JS library

::: code-group

```svelte [Svelte 5]
<script>
  import { createAvatar } from '@dicebear/core';
  import { lorelei } from '@dicebear/collection';

  let { seed = 'John Doe' } = $props();

  const avatar = $derived(
    createAvatar(lorelei, {
      seed,
      size: 128,
      // ... other options
    }).toDataUri()
  );
</script>

<img src={avatar} alt="Avatar" />
```

```svelte [Svelte 4]
<script>
  import { createAvatar } from '@dicebear/core';
  import { lorelei } from '@dicebear/collection';

  export let seed = 'John Doe';

  $: avatar = createAvatar(lorelei, {
    seed,
    size: 128,
    // ... other options
  }).toDataUri();
</script>

<img src={avatar} alt="Avatar" />
```

:::

## With the HTTP API

::: code-group

```svelte [Svelte 5]
<script>
  let { seed = 'John Doe' } = $props();

  const src = $derived.by(() => {
    const url = new URL('https://api.dicebear.com/9.x/lorelei/svg');
    url.searchParams.set('seed', seed);
    url.searchParams.set('size', '128');
    // ... other options
    return url.href;
  });
</script>

<img src={src} alt="Avatar" />
```

```svelte [Svelte 4]
<script>
  export let seed = 'John Doe';

  let src = '';

  $: {
    const url = new URL('https://api.dicebear.com/9.x/lorelei/svg');
    url.searchParams.set('seed', seed);
    url.searchParams.set('size', '128');
    // ... other options
    src = url.href;
  }
</script>

<img src={src} alt="Avatar" />
```

:::
