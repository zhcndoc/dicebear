---
title: Access All Available Style Options Programmatically | DiceBear
description: >
  Learn how to programmatically access all available options of a DiceBear
  avatar style using the OptionsDescriptor class.
---

# How to programmatically access all available options of an avatar style?

Each avatar style has different options depending on its components and colors.
The `OptionsDescriptor` class lets you discover all available options at
runtime.

## JavaScript

```js
import { Style, OptionsDescriptor } from '@dicebear/core';
import definition from '@dicebear/styles/micah.json' with { type: 'json' };

const style = new Style(definition);
const descriptor = new OptionsDescriptor(style);

console.log(descriptor.toJSON());
```

## PHP

```php
use Composer\InstalledVersions;
use DiceBear\Style;
use DiceBear\OptionsDescriptor;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$definition = json_decode(file_get_contents($basePath . '/src/micah.json'), true);

$style = new Style($definition);
$descriptor = new OptionsDescriptor($style);

print_r($descriptor->toJSON());
```

## Python

```python
import json
from importlib.resources import files

from dicebear import OptionsDescriptor, Style

definition = json.loads(
    files("dicebear_styles").joinpath("micah.json").read_text("utf-8")
)

style = Style(definition)
descriptor = OptionsDescriptor(style)

print(descriptor.to_json())
```

## Go

```go
import (
	"fmt"

	dicebear "github.com/dicebear/dicebear-go/v10"
	"github.com/dicebear/styles/v10"
)

style, _ := dicebear.NewStyle([]byte(styles.Micah))
descriptor := dicebear.NewOptionsDescriptor(style).ToJSON()

fmt.Println(descriptor)
```

## Field descriptor types

The `toJSON()` method returns a map of option names to field descriptors. Each
descriptor has a `type` and additional properties depending on the type:

| Type      | Properties                     | Example option           |
| --------- | ------------------------------ | ------------------------ |
| `string`  | `list?`                        | `seed`, `fontFamily`     |
| `number`  | `min?`, `max?`, `list?`        | `fontWeight`             |
| `boolean` |                                | `idRandomization`        |
| `enum`    | `values`, `list?`, `weighted?` | `flip`, `*Variant`       |
| `color`   | `list?`, `contrastTo?`         | `*Color`                 |
| `range`   | `min?`, `max?`                 | `rotate`, `borderRadius` |

- `list` indicates the option also accepts an array of values.
- `weighted` (on enum fields) means the option additionally accepts a
  `Record<string, number>` weight map for PRNG selection.
- `contrastTo` (on color fields) names the color group the renderer will
  contrast against, so UIs can flag that this group's selection is
  contrast-driven rather than random. Only set when the style definition
  declares a `contrastTo` constraint on the group.

Component aliases (declared via `extends` in the definition) do not contribute
their own `${alias}Variant` / `${alias}Probability` entries to the descriptor —
they share their source component's user options.
