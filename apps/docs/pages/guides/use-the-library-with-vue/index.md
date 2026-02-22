# How to use the library with Vue?

You can use DiceBear with Vue either via the
[JS-Library](/how-to-use/js-library/) or the
[HTTP-API](/how-to-use/http-api/).

## With the JS library

```vue
<script setup>
import { computed } from 'vue';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const props = defineProps({
  seed: { type: String, default: 'John Doe' },
});

const avatar = computed(() =>
  createAvatar(lorelei, {
    seed: props.seed,
    size: 128,
    // ... other options
  }).toDataUri()
);
</script>

<template>
  <img :src="avatar" alt="Avatar" />
</template>
```

## With the HTTP API

```vue
<script setup>
import { computed } from 'vue';

const props = defineProps({
  seed: { type: String, default: 'John Doe' },
});

const src = computed(() => {
  const url = new URL('https://api.dicebear.com/9.x/lorelei/svg');
  url.searchParams.set('seed', props.seed);
  url.searchParams.set('size', '128');
  // ... other options
  return url.href;
});
</script>

<template>
  <img :src="src" alt="Avatar" />
</template>
```
