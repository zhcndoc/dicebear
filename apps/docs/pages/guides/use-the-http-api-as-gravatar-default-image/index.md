---
title: DiceBear 作为 Gravatar 默认头像
description: >
  使用 DiceBear 的头像 API 作为注重隐私的 Gravatar 备用图片。简单
  的基于 URL 集成，无需身份验证。
---

# DiceBear 作为 Gravatar 默认头像

你可以将 DiceBear 的 HTTP API 用作 Gravatar 默认图片。但在此之前，
我们先看看 Gravatar 默认图片的条件：

> 1. ✅ 必须可公开访问（例如，不能位于内网、本地开发机器上，也不能在 HTTP Auth 或其他防火墙之后等）。默认图片会经过安全扫描，以避免恶意内容。
> 2. ✅ 必须可通过 HTTP 或 HTTPS 在标准端口上访问，分别为 80 和 443。
> 3. ⚠️ 必须具有可识别的图片扩展名（jpg、jpeg、gif、png、heic）
> 4. ⚠️ 不得包含查询字符串（如果包含，将被忽略）

> 来源：https://docs.gravatar.com/sdk/images/#default-image

由于 Gravatar 不支持 SVG，我们必须使用 PNG 端点。

::: code-group

<!-- prettier-ignore -->
```js [JavaScript]
const emailHash = encodeURIComponent('00000000000000000000000000000000');
const defaultImage = encodeURIComponent(
  'https://api.dicebear.com/10.x/lorelei/svg' // [!code --]
  'https://api.dicebear.com/10.x/lorelei/png' // [!code ++]
);

const gravatarImage = `https://www.gravatar.com/avatar/${emailHash}?d=${defaultImage}`;
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng
```

<!-- prettier-ignore -->
```php [PHP]
$emailHash = urlencode('00000000000000000000000000000000');
$defaultImage = urlencode(
  'https://api.dicebear.com/10.x/lorelei/svg' // [!code --]
  'https://api.dicebear.com/10.x/lorelei/png' // [!code ++]
);

$gravatarImage = sprintf(
  'https://www.gravatar.com/avatar/%s?d=%s',
  $emailHash,
  $defaultImage
);
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng
```

:::

通常我们会在查询字符串中设置选项，例如 seed。由于 Gravatar 不允许查询
字符串，[HTTP-API](/how-to-use/http-api/) 允许你在路径中指定选项。
只需将问号替换为斜杠，并对选项进行编码。

::: code-group

```js [JavaScript]
const emailHash = encodeURIComponent('00000000000000000000000000000000');
const options = `seed=${emailHash}`;
const defaultImage = encodeURIComponent(
  `https://api.dicebear.com/10.x/lorelei/png?${options}` // [!code --]
  `https://api.dicebear.com/10.x/lorelei/png/${encodeURIComponent(options)}`, // [!code ++]
);

const gravatarImage = `https://www.gravatar.com/avatar/${emailHash}?d=${defaultImage}`;
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng%2Fseed%253D00000000000000000000000000000000
```

<!-- prettier-ignore -->
```php [PHP]
$emailHash = urlencode('00000000000000000000000000000000');
$options = sprintf('seed=%s', $emailHash);
$defaultImage = urlencode(
  'https://api.dicebear.com/10.x/lorelei/png?' . $options // [!code --]
  'https://api.dicebear.com/10.x/lorelei/png/' . urlencode($options) // [!code ++]
);

$gravatarImage = sprintf(
  'https://www.gravatar.com/avatar/%s?d=%s',
  $emailHash,
  $defaultImage
);
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng%2Fseed%253D00000000000000000000000000000000
```

:::
