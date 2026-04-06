---
title: Access All Available Style Options Programmatically | DiceBear
description: >
  Learn how to programmatically access all available options of a DiceBear
  avatar style using the OptionsDescriptor class.
---

# How to programmatically access all available options of an avatar style?

Each avatar style has different options depending on its components and colors.
The `OptionsDescriptor` class lets you discover all available options at runtime.

## JavaScript

```js
import { Style, OptionsDescriptor } from '@dicebear/core';
import definition from '@dicebear/definitions/micah.json' with { type: 'json' };

const style = new Style(definition);
const descriptor = new OptionsDescriptor(style);

console.log(descriptor.toJSON());
```

## PHP

```php
use Composer\InstalledVersions;
use DiceBear\Style;
use DiceBear\OptionsDescriptor;

$basePath = InstalledVersions::getInstallPath('dicebear/definitions');
$definition = json_decode(file_get_contents($basePath . '/src/micah.json'), true);

$style = new Style($definition);
$descriptor = new OptionsDescriptor($style);

print_r($descriptor->toJSON());
```

## Field descriptor types

The `toJSON()` method returns a map of option names to field descriptors. Each
descriptor has a `type` and additional properties depending on the type:

| Type      | Properties                        | Example option           |
| --------- | --------------------------------- | ------------------------ |
| `string`  | `list?`                           | `seed`, `fontFamily`     |
| `number`  | `min?`, `max?`, `list?`           | `fontWeight`             |
| `boolean` |                                   | `idRandomization`        |
| `enum`    | `values`, `list?`, `weighted?`    | `flip`, `*Variant`       |
| `color`   | `list?`                           | `*Color`                 |
| `range`   | `min?`, `max?`                    | `rotate`, `borderRadius` |

The `list` flag indicates the option accepts an array. The `weighted` flag
(on enum fields) indicates the option accepts a `Record<string, number>` for
weighted PRNG selection.
