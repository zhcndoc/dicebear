---
title: HTTP API – Generate SVG Avatars via URL
description: >
  Free avatar API and profile picture API by DiceBear. Generate random user
  avatars and user placeholder images with a simple URL. No authentication
  required.
---

<script setup>
import BrowserPreview from '@theme/components/ui/UiBrowserPreview.vue';
import DocsGrid from '@theme/components/docs/DocsGrid.vue';

const fileFormats = [
  {
    title: 'SVG',
    description: 'Recommended. Scales indefinitely, no size limit, higher rate limit.',
    badge: 'Recommended',
  },
  {
    title: 'PNG',
    description: 'Max. 256 × 256 px. Lower rate limit.',
  },
  {
    title: 'JPG',
    description: 'Max. 256 × 256 px. Lower rate limit.',
  },
  {
    title: 'WebP',
    description: 'Max. 256 × 256 px. Lower rate limit.',
  },
  {
    title: 'AVIF',
    description: 'Max. 256 × 256 px. Lower rate limit.',
  },
  {
    title: 'JSON',
    description: 'Returns avatar metadata as JSON — no image output.',
  },
];
</script>

# HTTP API – Generate SVG Avatars via URL

Our HTTP API is the simplest way to use DiceBear as a profile picture API or
avatar placeholder API — no authentication required.

## Usage

Use the following address and replace `<styleName>` with your preferred avatar
style (camelCase). Every official [avatar style](/styles/) is supported.

```
https://api.dicebear.com/9.x/<styleName>/svg
```

### A few examples

<BrowserPreview url="https://api.dicebear.com/9.x/pixel-art/svg" />
<BrowserPreview url="https://api.dicebear.com/9.x/lorelei/svg" />

:::info

We provide a large number of avatar styles from different artists. The avatar
styles are licensed under different licenses that the artists can choose
themselves. For a quick overview we have created an
[license overview](/licenses/) for you.

:::

## Options

All [core options](/how-to-use/js-library/#core-options) — such as `seed`,
`flip`, `rotate`, `scale`, `radius`, `backgroundColor`, and more — are
available as [query parameters](https://en.wikipedia.org/wiki/Query_string).
Style-specific options are listed on each [avatar style page](/styles/).
For example:

<BrowserPreview url="https://api.dicebear.com/9.x/pixel-art/svg?seed=John" />
<BrowserPreview url="https://api.dicebear.com/9.x/pixel-art/svg?seed=Jane" />

:::tip

If you want to pass more options, you connect them with a `&` as usual with
query strings.

:::

### Array options

Array values are separated by a comma. For example, the URL could look like this
if you want to provide the PRNG with several hair styles in addition to the
seed. Note that the avatar styles provide different options. In this example, we
use the [Pixel Art](/styles/pixel-art/) avatar style.

<BrowserPreview url="https://api.dicebear.com/9.x/pixel-art/svg?seed=John&hair=short01,short02,short03,short04,short05" />
<BrowserPreview url="https://api.dicebear.com/9.x/pixel-art/svg?seed=Jane&hair=long01,long02,long03,long04,long05" />

### Boolean options

Boolean values can be set as strings (`true` and `false`).

<BrowserPreview url="https://api.dicebear.com/9.x/lorelei/svg?flip=true" />
<BrowserPreview url="https://api.dicebear.com/9.x/lorelei/svg?flip=false" />

## File format

<DocsGrid :items="fileFormats" />

PNG, JPG, WebP and AVIF use the
[Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans) font and currently
supports the following subsets: `cyrillic`, `cyrillic-ext`, `devanagari`,
`greek`, `greek-ext`, `japanese`, `korean`, `latin`, `latin-ext`,
`simplified-chinese`, `thai` and `vietnamese`.

<BrowserPreview url="https://api.dicebear.com/9.x/bottts/svg" />
<BrowserPreview url="https://api.dicebear.com/9.x/bottts/png" />
<BrowserPreview url="https://api.dicebear.com/9.x/bottts/jpg" />
<BrowserPreview url="https://api.dicebear.com/9.x/bottts/webp" />
<BrowserPreview url="https://api.dicebear.com/9.x/bottts/avif" />

## Versioning

You can set the version in the URL. Just replace the `9.x` from the previous
examples with the one you want.

Supported versions: `5.x`, `6.x`, `7.x`, `8.x`, `9.x`

::: warning

We reserve the right to discontinue any version at any time without notice. You
can create your own instance of the API to be able to access discontinued
versions even afterwards.

:::

## Self-Hosted Avatar API

Need a private or commercial setup? You can [host the Avatar API yourself](/guides/host-the-http-api-yourself/) for full control over availability, rate limits, and data privacy.

## Fair Use & Rate Limits

Our API is free to use for non-commercial purposes, but please use it
responsibly. We reserve the right to block abusive users.

We currently limit requests per second to **50 for SVG** and **10 for PNG,
JPG, WebP, and AVIF**. Exceeding the limit returns HTTP `429 Too Many
Requests`. We reserve the right to change these limits at any time without
notice.

For commercial use or higher limits, please
[set up your own instance](/guides/host-the-http-api-yourself/).
We're happy to answer questions — open a
[discussion](https://github.com/orgs/dicebear/discussions) on GitHub.

## Changes and Availability

Please be aware that we reserve the right to update the API at any time. While
we will do our best to maintain backwards compatibility, we cannot guarantee
this. Even though we try to always return the same avatar, the design and
especially the source code may change. Additionally, we cannot guarantee that
the API will always be available. If you need consistent access to the API, we
recommend setting up [your own instance](/guides/host-the-http-api-yourself/).
