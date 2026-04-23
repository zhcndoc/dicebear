---
title: Contribute to the Library | DiceBear
description: >
  Learn how to contribute an avatar style, improve an existing one, or work
  on the DiceBear core packages.
---

# Contribute to the library

DiceBear is maintained across several repositories on GitHub. Each repo
has its own `CONTRIBUTING.md` with setup, scripts, testing, and release
instructions. Pick the one that matches what you want to work on.

## Avatar styles

New avatar styles and fixes to existing styles live in
[`dicebear/definitions`](https://github.com/dicebear/definitions). Most
styles are authored in Figma and exported with the
[DiceBear Exporter](/guides/create-an-avatar-style-with-figma/) plugin,
so the workflow there is not the usual "edit a JSON file" loop.

- [`CONTRIBUTING.md`](https://github.com/dicebear/definitions/blob/main/CONTRIBUTING.md)
  in `dicebear/definitions`

## Core library, CLI, documentation, editor

The JavaScript and PHP cores, the CLI, the VitePress documentation
(including the Playground), and the standalone editor all live in the
main [`dicebear/dicebear`](https://github.com/dicebear/dicebear)
monorepo. See:

- [`CONTRIBUTING.md`](https://github.com/dicebear/dicebear/blob/10.x/CONTRIBUTING.md)
  in `dicebear/dicebear`

It covers the monorepo layout, per-package workflow, cross-language
parity tests for `@dicebear/core` / `dicebear/core`, and the release
process.

## JSON Schema

The schema for avatar style definitions and runtime options is versioned
separately in
[`dicebear/schema`](https://github.com/dicebear/schema).

- [`CONTRIBUTING.md`](https://github.com/dicebear/schema/blob/main/CONTRIBUTING.md)
  in `dicebear/schema`

## Figma exporter plugin

The Figma plugin that produces new avatar style definitions lives in
[`dicebear/exporter-plugin-for-figma`](https://github.com/dicebear/exporter-plugin-for-figma).

- [`CONTRIBUTING.md`](https://github.com/dicebear/exporter-plugin-for-figma/blob/main/CONTRIBUTING.md)
  in `dicebear/exporter-plugin-for-figma`
