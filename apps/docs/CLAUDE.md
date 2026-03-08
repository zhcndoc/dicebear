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

## Design Tokens & Standards

All design tokens are defined in `main.scss` and `vars.scss`. Always use these
tokens instead of hardcoded values.

### Border Radius (`main.scss`)

| Token              | Value  | Usage                                     |
| ------------------ | ------ | ----------------------------------------- |
| `--vp-radius-xs`   | `8px`  | Small controls, tab buttons, dice buttons |
| `--vp-radius-sm`   | `12px` | Buttons, badges, inputs, social links     |
| `--vp-radius-md`   | `16px` | Small cards, VPFeature, custom blocks     |
| `--vp-radius-lg`   | `20px` | Medium cards, framework items, UiWindow   |
| `--vp-radius-xl`   | `24px` | Large cards, avatar previews              |

Never use hardcoded `border-radius` values — always reference a token. UiCard
maps its `radius` prop to these tokens (sm→md, md→lg, lg→xl).

### Shadows (`vars.scss`)

| Token            | Usage                                    |
| ---------------- | ---------------------------------------- |
| `--vp-shadow-1`  | Subtle elevation (active tabs, inputs)   |
| `--vp-shadow-2`  | Light cards, scroll buttons              |
| `--vp-shadow-3`  | Card hover, avatar showcases             |
| `--vp-shadow-4`  | Prominent elements (mockup avatars)      |
| `--vp-shadow-5`  | Hero elements, large mockup frames       |

Never use hardcoded `box-shadow` with raw `rgba()` — always use a shadow token.

### Motion (`main.scss`)

| Token              | Value                                  | Usage                  |
| ------------------ | -------------------------------------- | ---------------------- |
| `--ease-spring`    | `cubic-bezier(0.34, 1.56, 0.64, 1)`   | Interactive elements   |
| `--ease-smooth`    | `cubic-bezier(0.4, 0, 0.2, 1)`        | Layout transitions     |
| `--duration-fast`  | `0.2s`                                 | Hover color/opacity    |
| `--duration-mid`   | `0.35s`                                | Transform, box-shadow  |
| `--duration-slow`  | `0.6s`                                 | Card reveals, entries  |

Never hardcode `transition` durations or easing curves — always use the tokens.
When using `animation`, reference the tokens too:
`animation: name var(--duration-mid) var(--ease-spring) forwards;`

### Hover Effects

Interactive elements must use consistent hover transforms:

- **Buttons and cards with lift:** `translateY(-4px) scale(1.02)` — never more
  aggressive (no `-10px` or `scale(1.05)`)
- **Subtle links:** No `translateY`, only color/border/shadow changes
- **Card accent:** `inset 0 3px 0 var(--accent-color)` + glow shadow

### Card Title/Description Sizes

Cards in 3-column grids (AppHighlights, AppUseCases) use:

- **Title:** `18px` / `font-weight: 700`
- **Description:** `14px` / `line-height: 1.6` / `color: var(--vp-c-text-2)`
- **Title margin-bottom:** `8px`

### Grid Gaps

Use 8px-based gap values: `8px`, `16px`, `24px`, `32px`, `48px`, `64px`.
Standard card grid gap is `24px`. Never use arbitrary gap values.

### Responsive Breakpoints

| Breakpoint | Usage                                  |
| ---------- | -------------------------------------- |
| `640px`    | Mobile — UI primitives, small elements |
| `768px`    | Tablet — App section layouts           |
| `960px`    | Sidebar — VitePress layout shifts      |
| `1000px`   | Wide — 2-column content layouts        |

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

- **Umami** — Self-hosted analytics (`u.dicebear.com`)
