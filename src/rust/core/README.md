<h1><img src="https://www.dicebear.com/logo-readme.svg" width="28" /> DiceBear Core (Rust)</h1>

Rust implementation of the DiceBear avatar library. Generates deterministic SVG
avatars from style definitions and a seed string.

DiceBear is available for multiple languages. All implementations share the same
PRNG and rendering pipeline, producing identical SVG output for the same seed,
style, and options — regardless of the language used.

[Playground](https://www.dicebear.com/playground) |
[Documentation](https://www.dicebear.com/introduction)

## Installation

```sh
cargo add dicebear-core
```

Requires Rust 1.80 or newer (uses `std::sync::LazyLock`).

## Usage

```rust
use dicebear_core::{Avatar, Style};
use serde_json::json;

// From a style definition (JSON string)
let style = Style::from_str(definition_json)?;

let avatar = Avatar::new(&style, json!({
    "seed": "John Doe",
    "size": 128,
}))?;

avatar.to_svg();       // SVG string
avatar.to_data_uri();  // data:image/svg+xml;charset=utf-8,...
```

### With options

```rust
let avatar = Avatar::new(&style, json!({
    "seed": "Jane",
    "size": 64,
    "flip": "horizontal",
    "backgroundColor": ["#0077b6", "#00b4d8"],
    "backgroundColorFill": "linear",
    "scale": [0.8, 1.0],
    "borderRadius": 10,
}))?;
```

### Using the Style type

```rust
use dicebear_core::{Avatar, OptionsDescriptor, Style};
use serde_json::json;

let style = Style::from_str(definition_json)?;

// Inspect available options for a style
let descriptor = OptionsDescriptor::new(&style).to_json();

// Create multiple avatars from the same style
let avatar1 = Avatar::new(&style, json!({ "seed": "Alice" }))?;
let avatar2 = Avatar::new(&style, json!({ "seed": "Bob" }))?;
```

## License

The source code of DiceBear is released under the **MIT License**.

## Sponsors

Advertisement: Many thanks to our sponsors who provide us with free or
discounted products.

<a href="https://bunny.net/" target="_blank" rel="noopener noreferrer">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://www.dicebear.com/sponsors/bunny-light.svg">
        <source media="(prefers-color-scheme: light)" srcset="https://www.dicebear.com/sponsors/bunny-dark.svg">
        <img alt="bunny.net" src="https://www.dicebear.com/sponsors/bunny-dark.svg" height="64">
    </picture>
</a>
