# How to use the library with React Native?

You can use DiceBear with [React Native](https://reactnative.dev/) either via
the [JS-Library](/how-to-use/js-library/) or the
[HTTP-API](/how-to-use/http-api/).

## With the JS library

You need an SVG library to render the avatars. In our example we use the package
[react-native-svg](https://www.npmjs.com/package/react-native-svg).

```
npm install react-native-svg
```

```jsx
import { useMemo } from 'react';
import { View } from 'react-native';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';

export default function Avatar({ seed = 'John Doe' }) {
  const avatar = useMemo(() => {
    return createAvatar(lorelei, {
      seed,
      size: 128,
      // ... other options
    }).toString();
  }, [seed]);

  return (
    <View>
      <SvgXml xml={avatar} />
    </View>
  );
}
```

## With the HTTP API

With the HTTP API you can use the PNG format and the built-in `Image` component
without any additional dependencies.

```jsx
import { useMemo } from 'react';
import { Image, View } from 'react-native';

export default function Avatar({ seed = 'John Doe' }) {
  const avatar = useMemo(() => {
    const url = new URL('https://api.dicebear.com/9.x/lorelei/png');
    url.searchParams.set('seed', seed);
    url.searchParams.set('size', '128');
    // ... other options
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
