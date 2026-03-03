---
title: CLI – Generate Avatars from the Command Line | DiceBear
description: >
  Generate avatars in bulk with the DiceBear CLI. Free command-line avatar
  generator for creating profile pictures and user placeholder images. All
  styles supported.
---

# CLI

With the CLI you can create thousands of avatars in no time!

## Installation

Make sure you have [Node.js](https://nodejs.org/en/) (version 18 or higher) and
npm installed.

```
npm install dicebear --global
```

## Upgrade

For the latest features and avatar styles, make sure you update the CLI
regularly.

```
npm install dicebear --global
```

## Usage

### Create an avatar

Replace `<style>` with an avatar style name (camelCase) and `[outputPath]` with
a target directory. If `[outputPath]` is omitted, the current directory is used
as target directory.

```
dicebear <style> [outputPath]
```

For example, to create an avatar with the [lorelei](/styles/lorelei/) avatar
style, use the following command:

```
dicebear lorelei ./avatars
```

The avatar will be saved as `lorelei-0.svg` in the `./avatars` directory.

:::info

We provide a large number of avatar styles from different artists. The avatar
styles are licensed under different licenses that the artists can choose
themselves. For a quick overview we have created an
[license overview](/licenses/) for you.

:::

### Create multiple avatars

You can also create multiple avatars at once! Just use the `--count` option.
Replace `<count>` with the number of avatars to create.

```
dicebear <style> [outputPath] --count <count>
```

For example, to create 100 avatars:

```
dicebear lorelei ./avatars --count 100
```

This generates files named `lorelei-0.svg`, `lorelei-1.svg`, ...,
`lorelei-99.svg`.

:::warning

The `seed` option has no effect in combination with the `count` option. If
`count` is greater than `1`, random values are generated and used as `seed` to
make the avatars differ from each other.

:::

:::tip Performance

The CLI uses parallel processing based on your CPU cores. Generating large
batches of avatars is optimized for performance.

:::

### Output formats

You can create avatars in various formats using the `--format` option:

| Format | Description                        |
| ------ | ---------------------------------- |
| `svg`  | Scalable Vector Graphics (default) |
| `png`  | PNG image                          |
| `jpg`  | JPEG image                         |
| `jpeg` | JPEG image (alias for jpg)         |
| `webp` | WebP image                         |
| `avif` | AVIF image                         |
| `json` | JSON with avatar metadata          |

Example:

```
dicebear lorelei ./avatars --format png
```

#### Controlling the output image size

`--size` controls the output dimensions (width and height in pixels) for all
formats. The default is `512`. For rasterized formats (PNG, JPEG, WebP, AVIF) the
value is capped at `2048`.

```
dicebear lorelei ./avatars --format png --size 256
```

::: warning Breaking change in v9.4.0 (rasterized formats only)

Before v9.4.0, the rasterized output size was derived from the SVG's `width` and
`height` attributes. It is now always set by `--size`, regardless of the SVG
dimensions.

:::

#### Adding Exif metadata

When creating PNG, JPEG, WebP, or AVIF images, you can include Exif metadata:

```
dicebear lorelei ./avatars --format png --exif
```

#### Saving JSON alongside images

You can save a JSON file with avatar metadata alongside each image:

```
dicebear lorelei ./avatars --format png --json
```

This creates both `lorelei-0.png` and `lorelei-0.json` for each avatar.

### Passing style options

Each avatar style has its own customization options. To see all available
options for a specific style, use `--help`:

```
dicebear lorelei --help
```

Example output:

```
dicebear lorelei [outputPath]

Generate "lorelei" avatar(s)

Options:
      --version            Show version number                         [boolean]
      --help               Show help                                   [boolean]
      --count              Defines how many avatars to create.          [number]
      --format                [string] [choices: "svg", "png", "jpg", ...]
      --exif               Include Exif Metadata                       [boolean]
      --json               Save JSON file in addition to image file    [boolean]
      --seed                                                            [string]
      --flip                                                           [boolean]
      --rotate                                                          [number]
      --scale                                                           [number]
      --radius                                                          [number]
      --size                                                            [number]
      --backgroundColor                                                  [array]
      --backgroundType                                                   [array]
      --backgroundRotation                                               [array]
      --translateX                                                      [number]
      --translateY                                                      [number]
      --clip                                                           [boolean]
      --randomizeIds                                                   [boolean]
      ... (style-specific options)
```

Example with options:

```
dicebear lorelei ./avatars --backgroundColor b6e3f4,c0aede,d1d4f9 --size 128
```

### Output file naming

Files are named using the pattern `{style}-{index}.{format}`:

- `lorelei-0.svg`
- `lorelei-1.png`
- `avataaars-0.webp`

The index starts at 0 and increments for each avatar created.

:::warning File overwrite protection

The CLI will **not** overwrite existing files. If a file already exists at the
target path, an error will be thrown. Make sure to use an empty directory or
remove existing files before generating new avatars.

:::

### License banner

Before generating avatars, the CLI displays a license banner with information
about the style's creator and license:

```
----------------------------------------------------------------
Lorelei by Lisa Wischofsky
Homepage: https://www.instagram.com/lischi_art/
Source: https://www.figma.com/community/file/1198749693280469639
License: CC0 1.0 - https://creativecommons.org/publicdomain/zero/1.0/
----------------------------------------------------------------
```

### Show help

For general help and a list of all available styles:

```
dicebear --help
```

```
dicebear <command>

Commands:
  dicebear adventurer [outputPath]         Generate "adventurer" avatar(s)
  dicebear adventurerNeutral [outputPath]  Generate "adventurerNeutral" avatar(s)
  dicebear avataaars [outputPath]          Generate "avataaars" avatar(s)
  dicebear avataaarsNeutral [outputPath]   Generate "avataaarsNeutral" avatar(s)
  dicebear bigEars [outputPath]            Generate "bigEars" avatar(s)
  dicebear bigEarsNeutral [outputPath]     Generate "bigEarsNeutral" avatar(s)
  dicebear bigSmile [outputPath]           Generate "bigSmile" avatar(s)
  dicebear bottts [outputPath]             Generate "bottts" avatar(s)
  dicebear botttsNeutral [outputPath]      Generate "botttsNeutral" avatar(s)
  dicebear croodles [outputPath]           Generate "croodles" avatar(s)
  dicebear croodlesNeutral [outputPath]    Generate "croodlesNeutral" avatar(s)
  dicebear dylan [outputPath]              Generate "dylan" avatar(s)
  dicebear funEmoji [outputPath]           Generate "funEmoji" avatar(s)
  dicebear glass [outputPath]              Generate "glass" avatar(s)
  dicebear icons [outputPath]              Generate "icons" avatar(s)
  dicebear identicon [outputPath]          Generate "identicon" avatar(s)
  dicebear initials [outputPath]           Generate "initials" avatar(s)
  dicebear lorelei [outputPath]            Generate "lorelei" avatar(s)
  dicebear loreleiNeutral [outputPath]     Generate "loreleiNeutral" avatar(s)
  dicebear micah [outputPath]              Generate "micah" avatar(s)
  dicebear miniavs [outputPath]            Generate "miniavs" avatar(s)
  dicebear notionists [outputPath]         Generate "notionists" avatar(s)
  dicebear notionistsNeutral [outputPath]  Generate "notionistsNeutral" avatar(s)
  dicebear openPeeps [outputPath]          Generate "openPeeps" avatar(s)
  dicebear personas [outputPath]           Generate "personas" avatar(s)
  dicebear pixelArt [outputPath]           Generate "pixelArt" avatar(s)
  dicebear pixelArtNeutral [outputPath]    Generate "pixelArtNeutral" avatar(s)
  dicebear rings [outputPath]              Generate "rings" avatar(s)
  dicebear shapes [outputPath]             Generate "shapes" avatar(s)
  dicebear thumbs [outputPath]             Generate "thumbs" avatar(s)
  dicebear toonHead [outputPath]           Generate "toonHead" avatar(s)

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

## Examples

### Generate a single avatar with a specific seed

```
dicebear avataaars ./avatars --seed "john-doe"
```

### Generate 50 PNG avatars with custom background

```
dicebear bottts ./avatars --count 50 --format png --backgroundColor b6e3f4
```

### Generate avatars with JSON metadata

```
dicebear pixelArt ./avatars --count 10 --format webp --json
```

### Generate initials avatar

```
dicebear initials ./avatars --seed "John Doe"
```

## Troubleshooting

### "File already exists" error

The CLI does not overwrite existing files. Either:

- Use an empty output directory
- Delete existing files before regenerating

### Avatar style not found

Make sure you're using the correct camelCase style name. Run `dicebear --help`
to see all available styles.

### Permission denied

Make sure you have write permissions to the output directory. On Unix systems,
you may need to adjust directory permissions or use `sudo` for global
installation.
