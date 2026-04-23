# Contributing

Thanks for your interest in contributing to DiceBear.

This is the main monorepo: the JavaScript and PHP core libraries, the
CLI, the docs site, and the editor all live here. Repositories covering
the JSON Schema, the avatar style definitions, the HTTP API, and the
Figma exporter are separate and each have their own `CONTRIBUTING.md`:

- [`dicebear/schema`](https://github.com/dicebear/schema/blob/main/CONTRIBUTING.md): JSON Schema for definitions and options
- [`dicebear/definitions`](https://github.com/dicebear/definitions/blob/main/CONTRIBUTING.md): Official avatar style definitions
- [`dicebear/api`](https://github.com/dicebear/api/blob/main/CONTRIBUTING.md): Self-hostable HTTP API
- [`dicebear/exporter-plugin-for-figma`](https://github.com/dicebear/exporter-plugin-for-figma/blob/main/CONTRIBUTING.md): Figma plugin

If your contribution belongs to one of those repos, read its file first.
The instructions below only cover this monorepo.

## Before you start

- Bug fixes, small improvements, new tests: open a pull request against
  the branch that matches the target major (for DiceBear 10 that's
  `10.x`; the current stable line lives on `9.x`).
- New avatar styles: contribute them to
  [`dicebear/definitions`](https://github.com/dicebear/definitions), not
  here. The walkthrough is in
  [Create an avatar style with Figma](https://www.dicebear.com/guides/create-an-avatar-style-with-figma/)
  or
  [Create an avatar style from scratch](https://www.dicebear.com/guides/create-an-avatar-style-from-scratch/).
- Larger changes (new public API, rendering behavior, breaking changes):
  open an issue first so we can agree on scope before you spend time on
  it.
- Security issues go privately to <contact@dicebear.com>; never
  file a public issue for a vulnerability.
- Contributors follow the
  [DiceBear Code of Conduct](https://github.com/dicebear/.github/blob/main/CODE_OF_CONDUCT.md).

## Requirements

- [Node.js](https://nodejs.org/) 20 or newer (CI runs on 20, 22, 24, 25)
- npm 11 (this repo pins `packageManager` in `package.json`; use
  [Corepack](https://nodejs.org/api/corepack.html) if you don't already)
- For PHP work: PHP 8.2+ and Composer, plus `vendor/bin/phpunit` via
  `composer install` inside `src/php/core/`

## Local setup

```sh
git clone git@github.com:dicebear/dicebear.git
cd dicebear
npm install
```

The monorepo uses npm workspaces (`src/js/*` and `apps/*`) driven by
[Turborepo](https://turborepo.com/). A single install at the root is
enough; do not `npm install` inside individual packages.

## Common scripts

Run these from the repo root:

| Script                | What it does                                               |
| --------------------- | ---------------------------------------------------------- |
| `npm run build`       | Builds every workspace via Turbo                           |
| `npm test`            | Runs every workspace's test target                         |
| `npm run test:scripts`| Runs the repo-level scripts in `tests/**/*.test.js`        |
| `npm run lint`        | Runs ESLint across the repo with caching                   |
| `npm run lint:fix`    | Same, with `--fix`                                         |
| `npm run prettier`    | Formats `src/` and `apps/` with Prettier                   |

For faster loops, scope to a single workspace:

```sh
npm run build --workspace @dicebear/core
npm run test  --workspace @dicebear/core
```

## Repository layout

```
src/
├── js/              # TypeScript packages published to npm
│   ├── core/          # Rendering engine (@dicebear/core)
│   ├── cli/           # Command-line interface
│   └── converter/     # SVG → raster converter
└── php/             # PHP port (Composer package `dicebear/core`)
apps/
├── docs/            # VitePress documentation site (dicebear.com), including the Playground
└── editor/          # The in-browser editor (editor.dicebear.com)
tests/
└── fixtures/parity/ # Cross-language parity fixtures (see below)
scripts/
└── version.mjs      # Bumps versions across the workspace and tags
```

## Working on a package

### TypeScript packages (`src/js/*`)

```sh
npm run build --workspace <package>
npm run test  --workspace <package>
```

If you are working on the CLI, call the compiled script directly once
you've built it:

```sh
node src/js/cli/bin/index.js <command>
```

### PHP core (`src/php/core/`)

```sh
cd src/php/core
composer install
vendor/bin/phpunit
```

### Cross-language parity

`@dicebear/core` and `dicebear/core` (PHP) must produce **byte-identical**
output for the same inputs. A shared fixture suite in
`tests/fixtures/parity/` enforces this, and both sides consume it:

- JS side: `src/js/core/tests/Parity.test.js`, run via
  `npm run test --workspace @dicebear/core`.
- PHP side: `tests/ParityTest.php`, run via `vendor/bin/phpunit` in
  `src/php/core/`.

The fixtures cover `Fnv1a` (hash + hex), `Mulberry32` (chained
sequences), every `Prng` method, and full `Avatar.toString()` output for
the `initials`, `thumbs`, `glass`, and `notionists` styles. That last
bucket covers seed, size, transforms, gradients, and component-variant
overrides.

If your change affects rendering or the PRNG in `@dicebear/core`,
regenerate the fixtures from the JS reference and commit the diff:

```sh
npm run fixtures:parity
```

The PHP suite will then fail loudly until the PHP side is brought back
in sync. That is the intended signal. If you only intend to touch one
language, expect to update both before your PR can be merged.

When porting DiceBear to another language, run these fixtures against
your implementation to prove it conforms. See
[Implement DiceBear Core](https://www.dicebear.com/specification/implement-dicebear-core/)
for the full spec.

## Documentation changes (`apps/docs/`)

The docs site is a VitePress app under `apps/docs/`.

```sh
npm run dev --workspace @dicebear/docs    # live reload on localhost
npm run build --workspace @dicebear/docs  # production build check
```

For larger editorial changes, open a draft PR early so reviewers can
follow along.

## Editor changes (`apps/editor/`)

The editor is the standalone app served at
[editor.dicebear.com](https://editor.dicebear.com).

```sh
npm run dev --workspace @dicebear/editor
npm run build --workspace @dicebear/editor
```

## Code style

- ESLint and Prettier decide what counts as correctly formatted code;
  run `npm run lint` and `npm run prettier` before you open a PR.
- TypeScript is `strict`. Prefer narrow types to `any` / `unknown`
  casts.
- PHP code follows PSR-12; `vendor/bin/phpunit` and Composer's built-in
  scripts catch the rest.

## Releasing (maintainers only)

> Only maintainers with write access can release new versions. This
> section is documented here for completeness.

Releases are triggered by Git tags. The version script updates every
package in the workspace, creates a commit, and creates the tag:

```sh
node scripts/version.mjs <version>
```

The version must be a valid [semver](https://semver.org/) value (e.g.
`10.1.0` or `10.2.0-alpha.1`). The script will:

1. Update `version` in every `package.json` across the workspace
2. Update internal workspace dependency references
3. Sync `package-lock.json`
4. Create a Git commit and tag (e.g. `v10.1.0`)

Push the commit and the tag:

```sh
git push && git push --tags
```

The tag triggers the
[Publish](https://github.com/dicebear/dicebear/actions/workflows/publish.yml)
workflow, which:

1. Runs the test suite on Node 20, 22, 24, and 25
2. Builds every package
3. Picks the npm dist-tag:
   - Tags containing `alpha`, `beta`, or `rc` go out as `next`
   - Other tags on the default branch go out as `latest`
   - Other tags on any other branch go out as `v<major>-lts` (so that
     backporting a patch to `9.x` after `10.x` has shipped does not
     overwrite `latest`)
4. Publishes all changed packages to npm via `scripts/publish.mjs`

## Licensing

By opening a pull request you agree that your contribution is released
under the repository's [MIT license](./LICENSE). Avatar style artwork in
`dicebear/definitions` may carry other licenses; see that repo's
`LICENSE.md` for details.
