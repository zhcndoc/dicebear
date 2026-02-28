---
title: React Avatar Library – DiceBear Integration
description: >
  Use DiceBear SVG avatars in React via JS library or avatar API. Generate
  deterministic profile pictures and user placeholder images in React apps.
---

# React Avatar Library – Using DiceBear with React

DiceBear integrates naturally into React via the JS library or the HTTP API.
Use `useMemo` to efficiently generate deterministic SVG profile pictures from a
seed, or use the HTTP API as a plain `<img src>` with no additional
dependencies.

You can use DiceBear with React either via the
[JS-Library](/how-to-use/js-library/) or the
[HTTP-API](/how-to-use/http-api/).

## With the JS library

```jsx
import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

export default function Avatar({ seed = 'John Doe' }) {
  const avatar = useMemo(() => {
    return createAvatar(lorelei, {
      seed,
      size: 128,
      // ... other options
    }).toDataUri();
  }, [seed]);

  return <img src={avatar} alt="Avatar" />;
}
```

## With the HTTP API

```jsx
import { useMemo } from 'react';

export default function Avatar({ seed = 'John Doe' }) {
  const avatar = useMemo(() => {
    const url = new URL('https://api.dicebear.com/9.x/lorelei/svg');
    url.searchParams.set('seed', seed);
    url.searchParams.set('size', '128');
    // ... other options
    return url.href;
  }, [seed]);

  return <img src={avatar} alt="Avatar" />;
}
```
