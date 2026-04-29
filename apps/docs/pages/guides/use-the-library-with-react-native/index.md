---
title: React Native 头像库 – DiceBear
description: >
  使用 DiceBear 在 React Native 中生成 SVG 用户头像。将
  JavaScript 头像库或头像 API 集成到你的移动应用中。
---

# React Native 头像库 – 在 React Native 中使用 DiceBear

DiceBear 可以通过带有 SVG
渲染器的 JavaScript 库在 React Native 中使用，也可以通过内置的 `Image`
组件使用 HTTP API 的 PNG 格式——对于 API 方式不需要 SVG 库。

你可以通过 [React Native](https://reactnative.dev/) 使用 DiceBear，方式可以是
[JS-Library](/how-to-use/js-library/) 或
[HTTP-API](/how-to-use/http-api/)。

## 使用 JS 库

你需要一个 SVG 库来渲染头像。在我们的示例中，我们使用包
[react-native-svg](https://www.npmjs.com/package/react-native-svg)。

```
npm install react-native-svg
```

```jsx
import { useMemo } from 'react';
import { View } from 'react-native';
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };
import { SvgXml } from 'react-native-svg';

export default function UserAvatar({ seed = 'John Doe' }) {
  const avatar = useMemo(() => {
    return new Avatar(lorelei, {
      seed,
      size: 128,
      // ... 其他选项
    }).toString();
  }, [seed]);

  return (
    <View>
      <SvgXml xml={avatar} />
    </View>
  );
}
```

## 使用 HTTP API

使用 HTTP API 时，你可以使用 PNG 格式和内置的 `Image` 组件，
而无需任何额外依赖。

```jsx
import { useMemo } from 'react';
import { Image, View } from 'react-native';

export default function Avatar({ seed = 'John Doe' }) {
  const avatar = useMemo(() => {
    const url = new URL('https://api.dicebear.com/10.x/lorelei/png');
    url.searchParams.set('seed', seed);
    url.searchParams.set('size', '128');
    // ... 其他选项
    return url.href;
  }, [seed]);

  return (
    <View>
      <Image
        source={{ uri: avatar }}
        style={{ width: 128, height: 128 }}
      />
    </View>
  );
}
```
