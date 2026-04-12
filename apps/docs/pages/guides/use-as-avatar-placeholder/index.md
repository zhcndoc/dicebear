---
title: Using DiceBear as an Avatar Placeholder API
description: >
  Use DiceBear as a deterministic avatar placeholder API for user profiles.
  Generate consistent SVG profile pictures from user IDs or emails — no image
  upload required.
---

<script setup>
import { Fingerprint, Zap, Server, Palette } from '@lucide/vue';
import BrowserPreview from '@theme/components/ui/UiBrowserPreview.vue';
import DocsHighlights from '@theme/components/docs/DocsHighlights.vue';
import DocsStyleGrid from '@theme/components/docs/DocsStyleGrid.vue';

const highlights = [
  {
    icon: Fingerprint,
    title: 'Deterministic',
    description:
      'The same seed always produces the same avatar. Use a user ID or email as the seed and the placeholder stays consistent across sessions and devices.',
    color: '#1689cc',
  },
  {
    icon: Zap,
    title: 'Zero Upload Required',
    description:
      'No images to store, no moderation needed. The avatar is generated on the fly — perfect for new users without a profile picture yet.',
    color: '#f59e0b',
  },
  {
    icon: Server,
    title: 'Self-Hostable',
    description:
      'Run your own instance of the HTTP API for full control over availability and data retention.',
    color: '#22c55e',
  },
  {
    icon: Palette,
    title: '30+ Styles',
    description:
      'Pick the visual style that fits your product — from abstract geometric shapes to illustrated characters.',
    color: '#a855f7',
  },
];

const styles = [
  {
    name: 'Initials',
    styleName: 'initials',
    link: '/styles/initials/',
    bestFor: 'Apps where showing user initials is conventional',
  },
  {
    name: 'Identicon',
    styleName: 'identicon',
    link: '/styles/identicon/',
    bestFor: 'Developer tools, version control, technical platforms',
  },
  {
    name: 'Pixel Art',
    styleName: 'pixel-art',
    link: '/styles/pixel-art/',
    bestFor: 'Gaming, retro, or developer-focused communities',
  },
  {
    name: 'Thumbs',
    styleName: 'thumbs',
    link: '/styles/thumbs/',
    bestFor: 'Friendly consumer apps and social platforms',
  },
  {
    name: 'Shapes',
    styleName: 'shapes',
    link: '/styles/shapes/',
    bestFor: 'Abstract, neutral placeholder for any context',
  },
];
</script>

# Using DiceBear as an Avatar Placeholder API

An avatar placeholder replaces the generic default shown when a user hasn't
uploaded a profile picture yet. Instead of a grey silhouette, DiceBear
generates a unique, deterministic SVG avatar from any seed — making every user
feel represented from the moment they sign up.

## Why DiceBear as a Placeholder?

<DocsHighlights :highlights="highlights" />

## With the HTTP API

The simplest approach: use a DiceBear API URL as the `src` of an `<img>` tag.
Use a stable identifier as the seed — a numeric user ID works well. For full
options and rate limit details, see the [HTTP API documentation](/how-to-use/http-api/).

<BrowserPreview url="https://api.dicebear.com/10.x/initials/svg?seed=JD" />
<BrowserPreview url="https://api.dicebear.com/10.x/pixel-art/svg?seed=user-42" />

```html
<img
  src="https://api.dicebear.com/10.x/initials/svg?seed=JD"
  alt="User avatar"
  width="48"
  height="48"
/>
```

### Fallback on Image Error

Combine DiceBear with an `onerror` handler to fall back gracefully when a
user's uploaded photo fails to load:

```html
<img
  src="/uploads/user-123.jpg"
  onerror="this.src='https://api.dicebear.com/10.x/pixel-art/svg?seed=123'; this.onerror=null;"
  alt="User avatar"
/>
```

### Using a User ID as Seed

Pass a stable, unique identifier as the seed to ensure each user always gets
the same placeholder:

```js
const userId = 'user-8f3a2c';
const avatarUrl = `https://api.dicebear.com/10.x/thumbs/svg?seed=${encodeURIComponent(userId)}`;
```

<BrowserPreview url="https://api.dicebear.com/10.x/thumbs/svg?seed=user-8f3a2c" />

## With the JavaScript Library

Use the JS library for server-side rendering or to embed the SVG directly in
your markup without an additional HTTP request. For full installation and API
details, see the [JavaScript library documentation](/how-to-use/js-library/).

```js
import { Avatar } from '@dicebear/core';
import thumbs from '@dicebear/definitions/thumbs.json' with { type: 'json' };

function getPlaceholderAvatar(userId) {
  return new Avatar(thumbs, {
    seed: userId,
    size: 48,
    borderRadius: 50,
  }).toString();
}
```

## With the PHP Library

Use the PHP library for server-side rendering without an additional HTTP
request. For full installation and API details, see the
[PHP library documentation](/how-to-use/php-library/).

```php
<?php

use Composer\InstalledVersions;
use DiceBear\Style;
use DiceBear\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/definitions');
$definition = json_decode(file_get_contents($basePath . '/src/thumbs.json'), true);

$style = new Style($definition);

function getPlaceholderAvatar(Style $style, string $userId): string {
  return (string) new Avatar($style, [
    'seed' => $userId,
    'size' => 48,
    'borderRadius' => 50,
  ]);
}
```

## Choosing a Style

Different styles suit different use cases. Click a style to see all available
options.

<DocsStyleGrid :styles="styles" />

## Tip: Always Define a Size

Specify a `size` or CSS dimensions to avoid layout shift while the avatar
loads:

```js
// JS library
new Avatar(thumbs, { seed: userId, size: 48, borderRadius: 50 });
```

```php
// PHP library
new Avatar($style, ['seed' => $userId, 'size' => 48, 'borderRadius' => 50]);
```

```
// HTTP API
https://api.dicebear.com/10.x/thumbs/svg?seed=user-123&size=48&borderRadius=50
```
