---
title: Next.js 头像库 – DiceBear 集成
description: >
  在 Next.js（App Router 和 Pages Router）中使用 DiceBear SVG 头像。服务
  端组件渲染、客户端组件渲染，以及用于确定性个人资料图片的图像优化
  模式。
---

# Next.js 头像库 – 在 Next.js 中使用 DiceBear

DiceBear 可在所有 Next.js 渲染模式中使用——服务端组件、客户端
组件以及 Pages Router。默认推荐服务端生成，因为它不会在客户端生成任何
JavaScript，并且可以避免 hydration 陷阱。

你可以通过 [JS-Library](/how-to-use/js-library/) 或 [HTTP-API](/how-to-use/http-api/) 在 [Next.js](https://nextjs.org/) 中使用 DiceBear。

## App Router

### 服务端组件（推荐）

在 App Router 中，组件默认是服务端组件。在服务器端生成 SVG，并将其以内联
[data URI](https://en.wikipedia.org/wiki/Data_URI_scheme) 的形式输出——头像不会
向客户端发送任何 JavaScript。

```tsx
// app/components/UserAvatar.tsx
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

export function UserAvatar({ seed = 'Alice' }: { seed?: string }) {
  const dataUri = new Avatar(lorelei, {
    seed,
    size: 128,
    // ... 其他选项
  }).toDataUri();

  return <img src={dataUri} alt="头像" width={128} height={128} />;
}
```

### 客户端组件

将文件标记为 `'use client'`，并使用 `useMemo` 包装生成逻辑，这样头像只有在 seed
变化时才会重新生成。

```tsx
// app/components/UserAvatarClient.tsx
'use client';

import { useMemo } from 'react';
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

export function UserAvatarClient({ seed = 'Alice' }: { seed?: string }) {
  const dataUri = useMemo(
    () =>
      new Avatar(lorelei, {
        seed,
        size: 128,
        // ... 其他选项
      }).toDataUri(),
    [seed],
  );

  return <img src={dataUri} alt="头像" width={128} height={128} />;
}
```

::: warning Hydration 与 `idRandomization`

`idRandomization` 使用宿主环境中未设种子的 RNG，因此服务器和客户端
会生成不同的 ID，React 会抛出 hydration 不匹配警告。你可以：

- 在服务端组件中生成头像（无需 hydration），并且不要把 SVG 传给客户端组件，**或者**
- 保持 `idRandomization: false`，并依赖确定性的 ID。

如果你需要在同一页面上让多个头像的 ID 保持唯一，请将每个头像完全在服务器端渲染。

:::

### 路由处理程序（头像端点）

将 DiceBear 暴露在你自己的 URL 之后——这对通过自定义
`Cache-Control` 头进行缓存，或限制允许接受哪些 seed 很有用。

```ts
// app/api/avatar/[seed]/route.ts
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ seed: string }> },
) {
  const { seed } = await params;

  const svg = new Avatar(lorelei, { seed, size: 128 }).toString();

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
```

## Pages Router

Pages Router 默认将每个组件都视为客户端组件。像在普通 React 应用中一样使用 `useMemo`
即可——请参阅 [React 指南](/guides/use-the-library-with-react/) 了解标准模式。
通过 `getServerSideProps` 或 `getStaticProps` 进行服务端生成时，会将 SVG 作为 prop 返回，
从而避免客户端 bundle 开销。

```tsx
// pages/profile.tsx
import type { GetServerSideProps } from 'next';
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

type Props = { avatar: string };

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const avatar = new Avatar(lorelei, { seed: 'Alice', size: 128 }).toDataUri();

  return { props: { avatar } };
};

export default function Profile({ avatar }: Props) {
  return <img src={avatar} alt="头像" width={128} height={128} />;
}
```

## 使用 HTTP API

HTTP API 无需安装，并且在两个路由器中都可使用。使用普通的
`<img>` 标签即可——Next.js 默认不会预处理外部 SVG。

```tsx
export function UserAvatar({ seed = 'Alice' }: { seed?: string }) {
  const src = `https://api.dicebear.com/10.x/lorelei/svg?seed=${encodeURIComponent(seed)}&size=128`;

  return <img src={src} alt="头像" width={128} height={128} />;
}
```

如果你想将 `next/image` 与 HTTP API 一起使用，请请求栅格格式（PNG、
WebP、AVIF）——`next/image` 不会优化 SVG 源——并将
`api.dicebear.com` 添加到 `next.config.js` 中的 `images.remotePatterns`。

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

  return <Image src={src} alt="头像" width={128} height={128} />;
}
```
