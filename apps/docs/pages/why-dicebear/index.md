---
title: DiceBear - Your alternative to boring avatars
description: >
  DiceBear is the perfect alternative to boring avatars with JS-Library,
  HTTP-API and Command-line API.
aside: false
---

<script setup>
import BrowserPreview from '@theme/components/BrowserPreview.vue';
</script>

# DiceBear - Your alternative to boring avatars

If you are looking for a fresh alternative to boring avatars, then DiceBear is
exactly what you are looking for. With DiceBear you can create fascinating and
unique avatars in no time. Whether you're looking for geometric shapes, cute
characters or even pixel art, DiceBear offers a wide range of avatar styles to
bring your projects to life.

<p class="why-dicebear-tools">
  <a href="/playground/" aria-label="Playground" title="Playground" target="_blank">
    <img src="/why-dicebear/playground.webp" alt="Playground" />
    <span>Playground</span>
  </a>
  
  <a href="https://editor.dicebear.com/" aria-label="Editor" title="Editor" target="_blank">
    <img src="/why-dicebear/editor.webp" alt="Editor" />
    <span>Editor</span>
  </a>
</p>

<style>
  .why-dicebear-tools {
    display: flex;
    gap: 20px;
    width: 100%;
  }

  .why-dicebear-tools {
    margin: 32px 0 24px !important;
  }

  .why-dicebear-tools a::after {
    display: none !important;
  }

  .why-dicebear-tools a {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    text-decoration: none;
    color: inherit;
    font-size: 14px;
  }
</style>

One of the coolest aspects of DiceBear is the ability to create deterministic
avatars. This means you can generate the same avatar for every username or email
address - perfect for user profiles! Imagine how excited your users will be when
they see their customized avatars on your website or app. DiceBear makes it
possible - easy, super fast and a lot of fun!

## Many different avatar styles!

You can choose from 30+ different avatar styles by fantastic artists. Here is
just a small sample.

<p class="why-dicebear-preview">
  <a href="/styles/adventurer/" aria-label="Adventurer" title="Adventurer" target="_blank">
    <img alt="Example avatar #1" src="https://api.dicebear.com/9.x/adventurer-neutral/svg?size=96" />
  </a>

  <a href="/styles/initials/" aria-label="Initials" title="Initials" target="_blank">
    <img alt="Example avatar #2" src="https://api.dicebear.com/9.x/initials/svg?size=96&seed=Kitty" />
  </a>

  <a href="/styles/lorelei-neutral/" aria-label="Lorelei Neutral" title="Lorelei Neutral" target="_blank">
    <img alt="Example avatar #3" src="https://api.dicebear.com/9.x/lorelei-neutral/svg?size=96" />
  </a>

  <a href="/styles/pixel-art-neutral/" aria-label="Pixel Art Neutral" title="Pixel Art Neutral" target="_blank">
    <img alt="Example avatar #4" src="https://api.dicebear.com/9.x/pixel-art-neutral/svg?size=96" />
  </a>

  <a href="/styles/shapes/" aria-label="Shapes" title="Shapes" target="_blank">
    <img alt="Example avatar #5" src="https://api.dicebear.com/9.x/shapes/svg?size=96" />
  </a>

  <a href="/styles/thumbs/" aria-label="Thumbs" title="Thumbs" target="_blank">
    <img alt="Example avatar #6" src="https://api.dicebear.com/9.x/thumbs/svg?size=96" />
  </a>
</p>

Just wanna see all of them? Check out our [overview](/styles/)!

<style>
  .why-dicebear-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .why-dicebear-preview a::after {
    display: none !important;
  }
</style>

## Easy to use

Integration into your platform is a breeze thanks to the available
[JavaScript library](/how-to-use/js-library/), [HTTP-API](/how-to-use/http-api/)
and even [Command-line API](/how-to-use/cli/).

### HTTP-API

Our <strong>free, fast and stable</strong> HTTP-API handles tens of millions of
requests daily. You can create SVG, PNG, JPEG, WebP, and AVIF avatars for your
projects without a subscription. And thanks to the global CDN of our sponsor
[bunny.net](https://bunny.net/), the avatars are just a hop, skip and a jump
away from your users.

<BrowserPreview url="https://api.dicebear.com/9.x/lorelei/svg?seed=Mia" />

Take a look at our [HTTP-API](/how-to-use/http-api/) documentation.

### JS-Library

Alternatively, you can use the [JavaScript library](/how-to-use/js-library/) and
[CLI](/how-to-use/cli/), which do not send any data to us. Also the JavaScript
library is very easy to use:

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

let svg = createAvatar(lorelei, {
  seed: 'your-custom-seed',
  // any other options you want to add
}).toString();

console.log(svg); // Here is your unique SVG avatar!
```

Read more about the [JS library](/how-to-use/js-library/) and
[CLI](/how-to-use/cli/) in our documentation.

## Integration in React, Vue, Svelte, etc.

You can also use DiceBear with React, Vue, Svelte and similar without any
problems. Simply use our [HTTP-API](/how-to-use/http-api/) as an image source or
install the [JS-library](/how-to-use/js-library/) and use it as follows:

::: code-group

```jsx [react]
import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

function App() {
  const avatar = useMemo(() => {
    return createAvatar(lorelei, {
      size: 128,
      // ... other options
    }).toDataUri();
  }, []);

  return <img src={avatar} alt="Avatar" />;
}

export default App;
```

```vue [vue]
<script setup>
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  size: 128,
  // ... other options
}).toDataUri();
</script>

<template>
  <img :src="avatar" alt="Avatar" />
</template>
```

```svelte [svelte]
<script>
  import { createAvatar } from "@dicebear/core";
  import { lorelei } from "@dicebear/collection";

  let avatar = createAvatar(lorelei, {
    size: 128,
    // ... other options
  }).toDataUri();
</script>

<img src={avatar} alt="Avatar" />
```

:::

Read more about the use in [Angular](/guides/use-the-library-with-angular/),
[React](/guides/use-the-library-with-react/),
[Vue](/guides/use-the-library-with-vue/),
[Svelte](/guides/use-the-library-with-svelte/), etc. in our guides.

## Open Source

We believe in open source. All our code is available on
[GitHub](https://github.com/dicebear). Feel free to take a look at our code and
contribute. If you have any questions, feel free to
[open an issue](https://github.com/dicebear/dicebear/issues).

## License

While our code is MIT licensed, the avatar styles are licensed under different
licenses that the artists can choose themselves. For a quick overview we have
created an [license overview](/licenses/) for you.
