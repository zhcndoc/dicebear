# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DiceBear is an avatar library for designers and developers. It generates deterministic or random avatars as SVGs based on a seed and style options. The project provides a JavaScript library, CLI, HTTP API, and web-based tools.

## Monorepo Structure

This is a Turborepo-managed monorepo with npm workspaces:

- **`src/js/core/`** - Core avatar creation engine (`@dicebear/core`)
- **`src/js/converter/`** - SVG to PNG/JPEG conversion (`@dicebear/converter`, JS-only due to Next.js dual-export constraints)
- **`src/js/cli/`** - CLI tool (`dicebear` npm package)
- **`apps/docs/`** - VitePress documentation site with Vuetify
- **`apps/editor/`** - Vue 3 interactive avatar editor with PrimeVue

## Build Commands

```bash
# Root level (builds all packages)
npm run build          # turbo run build
npm run test           # turbo run test
npm run prettier       # format all code

# Filtered builds
npx turbo run build --filter='!@dicebear/docs' --filter='!@dicebear/editor'  # CI: skip apps
npx turbo run build --filter='@dicebear/docs...'    # docs + all dependencies
npx turbo run build --filter='@dicebear/editor...'  # editor + all dependencies

# Docs app (apps/docs/)
npm run dev            # vitepress dev server
npm run build          # vitepress build

# Editor app (apps/editor/)
npm run dev            # vite dev server
npm run build          # type-check + vite build
npm run lint           # eslint with auto-fix
```

## Testing

Tests use Node's built-in test runner (`node --test`):

```bash
# Run all tests from root
npm run test

# Run tests for a specific package
cd src/js/core && npm test
cd src/js/converter && npm test
```

## Architecture

### Core Avatar Creation Flow

1. `createAvatar(style, options)` in `@dicebear/core` is the main entry point
2. The PRNG (seeded random) generates deterministic results from a seed string
3. Styles implement a `create(context)` method that returns SVG components
4. The core handles transformations (scale, flip, rotate, translate), backgrounds, and sizing
5. Result object provides `.toString()`, `.toJson()`, `.toDataUri()` methods

### Apps Technology Stack

- **Docs**: VitePress 2.x, Vue 3, Vuetify 3, Pinia
- **Editor**: Vite, Vue 3, PrimeVue 4, Pinia, vue-i18n

## Node Requirements

- Core packages: Node >= 18.0.0
- Apps: Node >= 20.0.0
- CI tests run on Node 20, 22, 24, 25

## Publishing

Releases are triggered by Git tags (`v*`). The workflow:
1. `node scripts/version.mjs <version>` - bumps versions in all packages, commits and tags
2. Push commit and tag to remote
3. GitHub Actions publishes to npm via `node scripts/publish.mjs <dist-tag>`
