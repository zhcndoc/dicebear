# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DiceBear is an avatar library for designers and developers. It generates deterministic or random avatars as SVGs based on a seed and style options. The project provides a JavaScript library, CLI, HTTP API, and web-based tools.

## Monorepo Structure

This is a Lerna-managed monorepo with npm workspaces:

- **`packages/dicebear/`** - CLI tool (`dicebear` npm package)
- **`packages/@dicebear/core/`** - Core avatar creation engine
- **`packages/@dicebear/collection/`** - Aggregates all avatar styles into one import
- **`packages/@dicebear/converter/`** - SVG to PNG/JPEG conversion
- **`packages/@dicebear/[style]/`** - 34 individual avatar style packages (adventurer, avataaars, bottts, etc.)
- **`apps/docs/`** - VitePress documentation site with Vuetify
- **`apps/editor/`** - Vue 3 interactive avatar editor with PrimeVue

## Build Commands

```bash
# Root level (builds all packages)
npm run build          # lerna run build
npm run test           # lerna run test
npm run prettier       # format all code

# Docs app (apps/docs/)
npm run dev            # vitepress dev server
npm run build          # vitepress build

# Editor app (apps/editor/)
npm run dev            # vite dev server
npm run build          # type-check + vite build
npm run lint           # eslint with auto-fix
```

## Testing

Tests use `uvu` as the test runner:

```bash
# Run all tests from root
npm run test

# Run tests for a specific package
cd packages/@dicebear/core && npm test
cd packages/@dicebear/collection && npm test
cd packages/@dicebear/converter && npm test
```

## Architecture

### Core Avatar Creation Flow

1. `createAvatar(style, options)` in `@dicebear/core` is the main entry point
2. The PRNG (seeded random) generates deterministic results from a seed string
3. Styles implement a `create(context)` method that returns SVG components
4. The core handles transformations (scale, flip, rotate, translate), backgrounds, and sizing
5. Result object provides `.toString()`, `.toJson()`, `.toDataUri()` methods

### Style Package Structure

Each style in `packages/@dicebear/` follows the same pattern:
- Has peer dependency on `@dicebear/core`
- Exports a style object with `meta`, `schema`, and `create` function
- Contains SVG templates and option definitions

### Apps Technology Stack

- **Docs**: VitePress 2.x, Vue 3, Vuetify 3, Pinia
- **Editor**: Vite, Vue 3, PrimeVue 4, Pinia, vue-i18n

## Node Requirements

- Core packages: Node >= 18.0.0
- Apps: Node >= 20.0.0
- CI tests run on Node 20, 22, 24, 25

## Publishing

Releases are triggered by Git tags (`v*`). The workflow:
1. `npm run prepare-publish` - bumps versions with Lerna
2. Create and push a Git tag
3. GitHub Actions publishes to npm with OIDC authentication
