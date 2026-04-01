<h1><img src="https://www.dicebear.com/logo-readme.svg" width="28" /> DiceBear Core (PHP)</h1>

> [!NOTE]
> This is a **read-only split** of [`dicebear/dicebear`](https://github.com/dicebear/dicebear) (path: `src/php/core`).
> Please open issues and pull requests in the [main repository](https://github.com/dicebear/dicebear).

PHP implementation of the DiceBear avatar library. Generates deterministic SVG avatars from style definitions and a seed string.

DiceBear is available for multiple languages. All implementations share the same PRNG and rendering pipeline, producing identical SVG output for the same seed, style, and options — regardless of the language used.

[Playground](https://www.dicebear.com/playground) |
[Documentation](https://www.dicebear.com/introduction)

## Installation

```sh
composer require dicebear/core
```

Requires PHP 8.2+ and the `mbstring` extension.

## Usage

```php
use DiceBear\Avatar;

// From a style definition (JSON-decoded array)
$definition = json_decode(file_get_contents('path/to/style.json'), true);

$avatar = new Avatar($definition, [
    'seed' => 'John Doe',
    'size' => 128,
]);

echo $avatar;              // SVG string
echo $avatar->toDataUri(); // data:image/svg+xml;charset=utf-8,...
```

### With options

```php
$avatar = new Avatar($definition, [
    'seed' => 'Jane',
    'size' => 64,
    'flip' => 'horizontal',
    'backgroundColor' => ['#0077b6', '#00b4d8'],
    'backgroundColorFill' => 'linear',
    'scale' => [0.8, 1.0],
    'borderRadius' => 10,
]);
```

### Using the Style class

```php
use DiceBear\Style;
use DiceBear\Avatar;
use DiceBear\OptionsDescriptor;

$style = new Style($definition);

// Inspect available options for a style
$descriptor = new OptionsDescriptor($style);
$fields = $descriptor->toJSON();

// Create multiple avatars from the same style
$avatar1 = new Avatar($style, ['seed' => 'Alice']);
$avatar2 = new Avatar($style, ['seed' => 'Bob']);
```

## License

The source code of DiceBear is released under the **MIT License**.

## Sponsors

Advertisement: Many thanks to our sponsors who provide us with free or discounted products.

<a href="https://bunny.net/" target="_blank" rel="noopener noreferrer">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://www.dicebear.com/sponsors/bunny-light.svg">
        <source media="(prefers-color-scheme: light)" srcset="https://www.dicebear.com/sponsors/bunny-dark.svg">
        <img alt="bunny.net" src="https://www.dicebear.com/sponsors/bunny-dark.svg" height="64">
    </picture>
</a>
