---
title: React 头像库 – DiceBear 集成
description: >
  通过 JS 库或头像 API 在 React 中使用 DiceBear SVG 头像。在 React 应用中生成
  确定性的个人资料图片和用户占位图像。
---

# React 头像库 – 在 React 中使用 DiceBear

DiceBear 通过 JS 库或 HTTP API 自然地集成到 React 中。
使用 `useMemo` 可以基于种子高效生成确定性的 SVG 个人资料图片，或者将 HTTP API 作为普通的 `<img src>` 使用，无需额外
依赖。

你可以通过以下方式在 React 中使用 DiceBear：
[JS-Library](/how-to-use/js-library/) 或
[HTTP-API](/how-to-use/http-api/)。

## 使用 JS 库

```jsx
import { useMemo } from 'react';
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

export default function UserAvatar({ seed = 'John Doe' }) {
  const avatar = useMemo(() => {
    return new Avatar(lorelei, {
      seed,
      size: 128,
      // ... 其他选项
    }).toDataUri();
  }, [seed]);

  return <img src={avatar} alt="头像" />;
}
```

## 使用 HTTP API

```jsx
import { useMemo } from 'react';

export default function Avatar({ seed = 'John Doe' }) {
  const avatar = useMemo(() => {
    const url = new URL('https://api.dicebear.com/10.x/lorelei/svg');
    url.searchParams.set('seed', seed);
    url.searchParams.set('size', '128');
    // ... 其他选项
    return url.href;
  }, [seed]);

  return <img src={avatar} alt="头像" />;
}
```
