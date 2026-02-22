# Contribute to the editor

The editor at [editor.dicebear.com](https://editor.dicebear.com) is built with
[Vue 3](https://vuejs.org/), [Vite](https://vitejs.dev/) and
[PrimeVue](https://primevue.org/). You can find the source files in the
[dicebear/dicebear](https://github.com/dicebear/dicebear) repository in the
`apps/editor` folder.

## Requirements

- A GitHub account
- Git installed (Learn how to install Git
  [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
- [Node.js](https://nodejs.dev/en/) (>= 20) and
  [Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  installed

## Set up locally

1. [Create a fork](https://help.github.com/en/articles/fork-a-repo) from the
   [dicebear/dicebear](https://github.com/dicebear/dicebear) repository.

2. Clone the project:

   ```
   git clone https://github.com/<YOUR_GITHUB_USERNAME>/dicebear.git
   ```

   If you've set up SSH, you can do this instead:

   ```
   git clone git@github.com:<YOUR_GITHUB_USERNAME>/dicebear.git
   ```

3. Install dependencies:

   ```
   cd dicebear
   npm install
   ```

4. Create a build:

   ```
   npm run build
   ```

## Verifying your changes

You can start the editor locally on your computer with the following command to
check your changes:

```
npm run dev --workspace @dicebear/editor
```

Open `http://localhost:5173/` in your browser to see your changes.

You can also run the linter to check for code style issues:

```
npm run lint --workspace @dicebear/editor
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
to create a Pull Request.

## Deployment (maintainers only)

::: info
Only maintainers with write access to the repository can deploy the editor. This
section is documented here for completeness.
:::

The editor ([editor.dicebear.com](https://editor.dicebear.com)) is deployed
manually via a GitHub Actions workflow. It can be triggered from the "Actions"
tab on GitHub:

- [Deploy Editor](https://github.com/dicebear/dicebear/actions/workflows/deploy-editor.yml)
  — Builds the editor app and deploys it to the CDN.
