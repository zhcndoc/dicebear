---
title: Next.js 头像库 – DiceBear 集成
description: >
  在 Next.js 中使用 DiceBear SVG 头像（App Router 和 Pages Router）。
  服务端组件渲染、客户端组件渲染，以及用于确定性个人资料图片的图像优化
  模式。
---

# Next.js 头像库：在 Next.js 中使用 DiceBear

DiceBear 可在所有 Next.js 渲染模式下工作：服务端组件、客户端
组件以及 Pages Router。默认推荐使用服务端生成，因为它不会在客户端生成任何 JavaScript，并且可以避免
hydration 陷阱。

你可以通过 [JS-Library](/how-to-use/js-library/) 或 [HTTP-API](/how-to-use/http-api/) 在 [Next.js](https://nextjs.org/) 中使用 DiceBear。

## App Router

### Server Components (Recommended)

In the App Router, components are server components by default. Generate the SVG on the server and inline it as a
[data URI](https://en.wikipedia.org/wiki/Data_URI_scheme), so the avatar doesn't need any client-side JavaScript.

```tsx
// app/components/UserAvatar.tsx
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

export function UserAvatar({ seed = 'Alice' }: { seed?: string }) {
  const dataUri = new Avatar(style, {
    seed,
    size: 128,
    // ... other options
  }).toDataUri();

  return <img src={dataUri} alt="Avatar" width={128} height={128} />;
}
```

### Client Components

Mark the file with `'use client'`, and wrap the generation logic with `useMemo` so the avatar is only regenerated when the seed changes.

```tsx
// app/components/UserAvatarClient.tsx
'use client';

import { useMemo } from 'react';
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

export function UserAvatarClient({ seed = 'Alice' }: { seed?: string }) {
  const dataUri = useMemo(
    () =>
      new Avatar(style, {
        seed,
        size: 128,
        // ... other options
      }).toDataUri(),
    [seed],
  );

  return <img src={dataUri} alt="Avatar" width={128} height={128} />;
}
```

::: warning Hydration and `idRandomization`

`idRandomization` uses an unseded RNG in the host environment, so the server and client
will generate different IDs, and React will throw a hydration mismatch warning. You can either:

- Generate the avatar in a server component (no hydration required), and do not pass the SVG to a client component, **or**
- Keep `idRandomization: false` and rely on deterministic IDs.

If you need multiple avatars on the same page to keep their IDs unique, render each avatar entirely on the server.

:::

### Route Handlers (Avatar Endpoint)

Expose DiceBear behind your own URL. This is useful for caching with custom
`Cache-Control` headers, or for restricting the acceptable seeds.

```ts
// app/api/avatar/[seed]/route.ts
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ seed: string }> },
) {
  const { seed } = await params;

  const svg = new Avatar(style, { seed, size: 128 }).toString();

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
```

## Pages Router

Pages Router defaults to treating every component as a client component. Use `useMemo`
as you would in a normal React app.
See the [React Guide](/guides/use-the-library-with-react/) for standard patterns.
When generating on the server via `getServerSideProps` or `getStaticProps`, the
SVG is returned as a prop, avoiding loading the client bundle.

```tsx
// pages/profile.tsx
import type { GetServerSideProps } from 'next';
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

type Props = { avatar: string };

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const avatar = new Avatar(style, { seed: 'Alice', size: 128 }).toDataUri();

  return { props: { avatar } };
};

export default function Profile({ avatar }: Props) {
  return <img src={avatar} alt="头像" width={128} height={128} />;
}
```

## Using the HTTP API

The HTTP API requires no installation and is available in both routers. Just use a standard
`<img>` tag. Next.js does not preprocess external SVGs by default.

```tsx
export function UserAvatar({ seed = 'Alice' }: { seed?: string }) {
  const src = `https://api.dicebear.com/10.x/lorelei/svg?seed=${encodeURIComponent(seed)}&size=128`;

  return <img src={src} alt="Avatar" width={128} height={128} />;
}
```

If you want to use `next/image` with the HTTP API, request a raster format (PNG,
WebP, AVIF), because `next/image` does not optimize SVG sources and you need to add
`api.dicebear.com` to `images.remotePatterns` in `next.config.js`.

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'api.dicebear.com' }],
  },
};
```

```tsx
import Image from 'next/image';

export function UserAvatar({ seed = 'Alice' }: { seed?: string }) {
  const src = `https://api.dicebear.com/10.x/lorelei/png?seed=${encodeURIComponent(seed)}&size=128`;

  return <Image src={src} alt="Avatar" width={128} height={128} />;
}
```
