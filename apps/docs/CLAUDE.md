# CLAUDE.md — DiceBear Docs App

## Overview

VitePress-based documentation site for DiceBear at
[dicebear.com](https://www.dicebear.com). Custom theme built with Vue 3, Ark UI,
and SCSS.

## Commands

```bash
npm run dev       # VitePress dev server
npm run build     # Static site generation → .vitepress/dist/
npm run preview   # Preview production build
```

Node >= 20.0.0 required. ESM (`"type": "module"`).

## Project Structure

```
apps/docs/
├── pages/                          # Content source (srcDir)
│   ├── index.md                    # Homepage
│   ├── introduction/               # What is DiceBear?
│   ├── how-to-use/                 # JS Library, HTTP API, CLI
│   ├── guides/                     # Framework integration guides
│   ├── styles/                     # Individual avatar style pages
│   ├── playground/                 # Interactive playground
│   ├── licenses/                   # License info
│   ├── legal/                      # Privacy, site notice
│   ├── why-dicebear/               # Value proposition
│   └── public/                     # Static assets (favicons, logos, schemas)
├── .vitepress/
│   ├── config.ts                   # VitePress config (entry point)
│   ├── config/                     # Config modules (sidebars, avatar styles)
│   └── theme/
│       ├── index.ts                # Theme entry (extends DefaultTheme)
│       ├── Layout.vue              # Root layout with footer + sidebar slots
│       ├── types.ts                # Shared TypeScript types
│       ├── components/
│       │   ├── ui/                 # Reusable UI primitives (Ui* prefix)
│       │   ├── app/                # App-specific sections (App* prefix)
│       │   ├── playground/         # Playground feature components
│       │   ├── styles/             # Style documentation (Style* prefix)
│       │   ├── layout/             # Layout overrides (Footer, Sidebar)
│       │   └── pages/              # Full-page content components
│       ├── composables/            # Vue composables (use* prefix)
│       ├── stores/                 # Pinia stores
│       ├── styles/                 # SCSS (main.scss, vars.scss, ark-ui.scss)
│       ├── utils/                  # Pure helper functions
│       └── config/                 # Theme-level config (footer links)
├── scripts/                        # Build scripts
├── tsconfig.json
└── package.json
```

## Tech Stack

- **VitePress 2.x** — Static site generator
- **Vue 3** — `<script setup lang="ts">` everywhere
- **Ark UI (`@ark-ui/vue`)** — Headless UI components (Dialog, Select, Tooltip,
  Menu)
- **Pinia** — State management (playground store)
- **VueUse** — Vue composition utilities
- **Lucide** — Icons (`lucide-vue-next`)
- **highlight.js** — Syntax highlighting
- **SCSS** — Styling via CSS custom properties, scoped component styles

## Component Conventions

### Naming

| Directory     | Prefix       | Example                 |
| ------------- | ------------ | ----------------------- |
| `ui/`         | `Ui`         | `UiButton.vue`          |
| `app/`        | `App`        | `AppHero.vue`           |
| `styles/`     | `Style`      | `StylePreview.vue`      |
| `playground/` | `Playground` | `PlaygroundPreview.vue` |
| `layout/`     | `Layout`     | `LayoutFooter.vue`      |
| `pages/`      | `Page`       | `PageHome.vue`          |

### Component Pattern

```vue
<script setup lang="ts">
// TypeScript props via defineProps<{}>()
// Composables, imports, logic
</script>

<template>
  <!-- Template -->
</template>

<style lang="scss" scoped>
// Scoped SCSS styles
</style>
```

### File Naming

- **Components:** PascalCase (`UiButton.vue`)
- **Composables:** camelCase with `use` prefix (`useTypewriter.ts`)
- **Utilities:** kebab-case (`name-list.ts`)
- **Stores:** camelCase (`playground.ts`)

## Path Aliases

Defined in `tsconfig.json` and VitePress config:

- `@theme/*` → `.vitepress/theme/*`
- `@playground/*` → `.vitepress/theme/components/playground/*`

## Styling

- **No utility CSS framework** — All styling via SCSS with scoped styles
- **Nested SCSS** — Components use nested Sass syntax
- **No `:deep`** — Avoid `:deep()` selectors in component styles
- **Component-name prefix** — All SCSS classes use the component name as prefix
  (e.g. `.app-hero-title` in `AppHero.vue`)
- **CSS custom properties** for theming (defined in `vars.scss`)
- **VitePress CSS variables** as foundation, overridden where needed
- **Dark mode** via `.dark` class on `:root`
- **Ark UI styling** via data attributes in `ark-ui.scss` (`[data-scope]`,
  `[data-part]`)
- **Responsive** via media queries in component styles
- **No outer margin on components** — Components must not set outer margin
  (`margin`). Spacing between components is the responsibility of the consuming
  parent.
- **No unscoped cross-component styles** — Unscoped `<style>` blocks must not
  target classes of other components (e.g. `.ui-code { margin: 0 }` inside
  `AppIntegration.vue`). This circumvents Vue's scoped style isolation.
  Exception: styling own dynamically generated content (e.g. `v-html` with
  highlight.js classes) is acceptable.

## State Management

Single Pinia store: `stores/playground.ts`

- Manages selected avatar style, options, and defaults
- Reads initial state from URL query params
- Syncs with avatar style JSON schemas

## Composables

| File                     | Purpose                                      |
| ------------------------ | -------------------------------------------- |
| `avatar.ts`              | Avatar style loading, meta, schema, defaults |
| `useSchemaOptions.ts`    | Generate UI options from JSON Schema         |
| `useStyleFiltering.ts`   | Search, filter, group avatar styles          |
| `useTypewriter.ts`       | Rotating text typewriter effect              |
| `useVisibility.ts`       | Intersection Observer for animations         |
| `useParallax.ts`         | Mouse parallax effects                       |
| `useCopyToClipboard.ts`  | Clipboard API wrapper                        |
| `usePlaygroundDialog.ts` | Playground dialog state                      |

## DiceBear Integration

- Avatar styles loaded dynamically via `@dicebear/collection/async`
- Options generated from JSON Schema definitions in `@dicebear/core` and style
  packages
- Utilities in `utils/avatar.ts` for API URL building, CLI commands, preview
  options

## Content Authoring

Markdown files in `pages/` with:

- **Frontmatter:** `title`, `description`, `aside`, `editLink`, `layout`,
  `lang`, `dir`
- **Vue components** in markdown via `<script setup>` blocks
- **`Badge`** component registered globally
- **Style pages** follow a template pattern: `StylePreview` → `StyleDescription`
  → `StyleUsage` → `StyleOptions` → `StyleInfo`

## SSR Considerations

- Use `ClientOnly` wrapper for components that use browser APIs
- VitePress SSR config: `noExternal: ['vue-countup-v3', '@ark-ui/vue']`
- Check `typeof window !== 'undefined'` before accessing browser globals

## External Services

- **Umami** — Self-hosted analytics (`hi.dicebear.com`)
- **iubenda** — Cookie/privacy consent
