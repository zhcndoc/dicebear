# Contribute to the API

The HTTP API at [api.dicebear.com](https://api.dicebear.com) is built with
[Fastify](https://www.fastify.io/). It lives in a separate repository at
[dicebear/api](https://github.com/dicebear/api).

## Requirements

- A GitHub account
- Git installed (Learn how to install Git
  [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
- [Node.js](https://nodejs.dev/en/) (>= 20.10) and
  [Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  installed
- [Docker](https://www.docker.com/) (optional, for container testing)

## Project structure

```
dicebear/api/
├── src/              # Application source code
│   ├── app.ts        # Fastify app setup
│   ├── server.ts     # Server entry point
│   ├── config.ts     # Environment-based configuration
│   ├── types.ts      # Shared TypeScript types
│   ├── handler/      # Request handlers
│   ├── routes/       # Route definitions
│   └── utils/        # Utility functions (query string parsing, etc.)
├── versions/         # DiceBear library version packages (see below)
│   ├── 5.x/
│   ├── 6.x/
│   ├── 7.x/
│   ├── 8.x/
│   └── 9.x/
├── scripts/          # Build scripts (e.g. font extraction)
├── tests/            # Test suite
├── Dockerfile        # Production container definition
├── package.json      # Workspaces: root + versions/*
└── tsconfig.json
```

## Versioning

The API serves multiple DiceBear library versions in parallel (v5–v9). Each
version is accessible via a URL prefix, for example `/9.x/avataaars/svg`.

- Each version lives in `versions/<major>.x/` as a separate workspace package
  (e.g. `@dicebear/api-9`).
- Each version package depends on the corresponding `@dicebear/core` and
  `@dicebear/collection` versions.
- Which versions are loaded at runtime is controlled by the `VERSIONS`
  environment variable (default: `5,6,7,8,9`).
- When a new major DiceBear version is released, a new `versions/<major>.x/`
  package is added.

## Set up locally

1. [Create a fork](https://help.github.com/en/articles/fork-a-repo) from the
   [dicebear/api](https://github.com/dicebear/api) repository.

   ::: warning
   Make sure you fork [dicebear/api](https://github.com/dicebear/api), not the
   main [dicebear/dicebear](https://github.com/dicebear/dicebear) repository.
   :::

2. Clone the project:

   ```
   git clone https://github.com/<YOUR_GITHUB_USERNAME>/api.git
   ```

   If you've set up SSH, you can do this instead:

   ```
   git clone git@github.com:<YOUR_GITHUB_USERNAME>/api.git
   ```

3. Install dependencies:

   ```
   cd api
   npm install
   ```

4. Create a build:

   ```
   npm run build
   ```

## Verifying your changes

You can start the API locally on your computer with the following command to
check your changes:

```
npm run dev
```

Open `http://localhost:3000/` in your browser to see your changes.

You can also run the test suite:

```
npm test
```

## Branching and committing

Once you are happy with the changes, create a branch so you can commit the
changes.

```
git checkout -b <YOUR_BRANCH>
```

Afterwards you have to add your changes to the stage and commit them.

```
git add .
git commit -m "Change: <YOUR_CHANGES>"
git push origin <YOUR_BRANCH>
```

## Creating a Pull Request

Follow
[these instructions](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)
to create a Pull Request against
[dicebear/api](https://github.com/dicebear/api).

## Deployment (maintainers only)

::: info
Only maintainers with write access to the repository can deploy the API. This
section is documented here for completeness.
:::

The API ([api.dicebear.com](https://api.dicebear.com)) is deployed as a Docker
container. A GitHub Actions workflow (`docker.yml`) builds and publishes the
image to Docker Hub:
[dicebear/api](https://hub.docker.com/r/dicebear/api).
