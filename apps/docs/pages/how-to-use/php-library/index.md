---
title: PHP Avatar Library | DiceBear
description: >
  Use the DiceBear PHP library to generate SVG profile pictures on the server.
  PHP 8.2+ with an API identical to the JavaScript library.
---

# PHP Avatar Library

The PHP library provides an API identical to the
[JavaScript library](/how-to-use/js-library/). It requires PHP 8.2 or higher.
The same seed and style definition will produce byte-identical SVGs in both
implementations.

## Installation

You need two packages: the core library `dicebear/core` and the avatar style
definitions `dicebear/definitions`.

```
composer require dicebear/core dicebear/definitions
```

## Usage

```php
<?php

use Composer\InstalledVersions;
use DiceBear\Style;
use DiceBear\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/definitions');
$definition = json_decode(file_get_contents($basePath . '/src/lorelei.json'), true);

$style = new Style($definition);
$avatar = new Avatar($style, [
  'seed' => 'John Doe',
  // ... other options
]);

$svg = (string) $avatar;
```

Each avatar style comes with several options. You can find them on the details
page of each [avatar style](/styles/).

:::info

We provide a large number of avatar styles from different artists. The avatar
styles are licensed under different licenses that the artists can choose
themselves. For a quick overview we have created an
[license overview](/licenses/) for you.

:::

## Deterministic avatars

The `seed` option is the key to generating deterministic avatars. The same seed
will always produce the same avatar:

```php
$avatar1 = new Avatar($style, ['seed' => 'user-123']);
$avatar2 = new Avatar($style, ['seed' => 'user-123']);

(string) $avatar1 === (string) $avatar2; // true
```

## Classes

### `Avatar`

The main class for generating avatars. Accepts a `Style` instance (or raw
definition array) and optional options.

```php
use DiceBear\Avatar;

$avatar = new Avatar($style, [
  // ... options
]);
```

### `Style`

An immutable wrapper around a style definition. Reuse it when generating
multiple avatars from the same style.

```php
use DiceBear\Style;
use DiceBear\Avatar;

$style = new Style($definition);

$avatar1 = new Avatar($style, ['seed' => 'Alice']);
$avatar2 = new Avatar($style, ['seed' => 'Bob']);
```

### `OptionsDescriptor`

Describes all valid options for a given style. Useful for building UIs or
validating user input.

```php
use DiceBear\Style;
use DiceBear\OptionsDescriptor;

$descriptor = new OptionsDescriptor(new Style($definition));
$fields = $descriptor->toJSON();
```

## Methods

### `__toString()` / `toString()`

**Return type:** `string`

Returns the avatar as SVG in XML format. The `__toString()` magic method allows
using the avatar directly in string contexts.

```php
$avatar = new Avatar($style, ['seed' => 'John Doe']);

$svg = (string) $avatar;
// or
$svg = $avatar->toString();
```

### `toJSON()`

**Return type:** `array{svg: string, options: array}`

Returns an associative array with the SVG and the resolved options.

```php
$avatar = new Avatar($style, ['seed' => 'John Doe']);

$json = $avatar->toJSON();

// $json['svg']     → '<svg>...</svg>'
// $json['options'] → ['seed' => 'John Doe', ...]
```

### `toDataUri()`

**Return type:** `string`

Returns the avatar as [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme).

```php
$avatar = new Avatar($style, ['seed' => 'John Doe']);

$dataUri = $avatar->toDataUri();

// <img src="<?= $dataUri ?>" alt="Avatar" />
```

## Core options

The core options are identical to the JavaScript library. See the
[JS Library core options](/how-to-use/js-library/#core-options) for the full
reference. Here are the options in PHP syntax:

```php
$avatar = new Avatar($style, [
  'seed' => 'John Doe',
  'flip' => 'horizontal',         // 'none', 'horizontal', 'vertical', 'both'
  'rotate' => 10,                  // or [min, max] range
  'scale' => 90,                   // or [min, max] range
  'borderRadius' => 50,            // 0-50 (50 = circle)
  'size' => 128,
  'translateX' => 0,               // -100 to 100
  'translateY' => 0,               // -100 to 100
  'idRandomization' => true,
  'title' => 'User Avatar',
  'fontFamily' => 'Arial',         // or ['Arial', 'Helvetica']
  'fontWeight' => 700,             // 1-1000
  'backgroundColor' => ['#b6e3f4', '#c0aede'],
  'backgroundColorFill' => 'solid', // 'solid', 'linear', 'radial'
]);
```

Dynamic component and color options also work the same way. See the
[JS Library documentation](/how-to-use/js-library/#dynamic-component-options)
for all available patterns.

## Examples

### Avatar with custom background

```php
$avatar = new Avatar($style, [
  'seed' => 'John Doe',
  'backgroundColor' => ['#b6e3f4', '#c0aede', '#d1d4f9'],
]);
```

### Circular avatar

```php
$avatar = new Avatar($style, [
  'seed' => 'Jane',
  'size' => 128,
  'borderRadius' => 50,
]);
```

### Weighted variant selection

```php
$avatar = new Avatar($style, [
  'seed' => 'John Doe',
  'topVariant' => ['short01' => 2, 'short02' => 2, 'long01' => 1],
]);
```
