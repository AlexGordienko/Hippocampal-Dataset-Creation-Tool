# Dataset Creation Tool for NNM

A browser tool for hand-authoring TSV datasets for the [Emergent](https://github.com/emer/emergent)
neural simulation framework (used here for hippocampal modeling). Click cells in the
pattern grids to set activations, then export a `.tsv` whose layout matches Emergent's
tensor-column format.

Built with React and [Vite](https://vite.dev/), styled with [Tailwind CSS](https://tailwindcss.com/).

## Requirements

- Node.js 18+
- [Yarn](https://classic.yarnpkg.com/) (or use the equivalent `npm` commands)

## Getting started

Install dependencies:

```sh
yarn install
```

## Scripts

### `yarn dev`

Starts the Vite dev server with hot-module reloading and opens
[http://localhost:3000](http://localhost:3000).

### `yarn build`

Builds the production bundle to the `dist/` folder.

### `yarn preview`

Serves the built `dist/` bundle locally to preview the production build.

## Usage

1. Toggle cells in the **Input** and **EC Out** grids (for both charts) to mark active units.
2. Click **Download** to export `test_ab_ps.tsv`, ready to load into Emergent.
