# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A browser tool for hand-authoring TSV datasets consumed by the [Emergent](https://github.com/emer/emergent) neural simulation framework (used here for hippocampal modeling). The user clicks cells in a grid of pattern boxes to set activations, then exports a `.tsv` whose layout matches Emergent's tensor-column format. There is no backend — everything runs client-side and the export is a generated `Blob` download.

## Commands

- `yarn dev` — Vite dev server with HMR on http://localhost:3000 (opens the browser; port set in `vite.config.js`).
- `yarn build` — production build to `dist/`.
- `yarn preview` — serve the built `dist/` bundle locally.

There is no test suite. Stack: Vite + React 18 (class components) + Tailwind CSS 3. ESM throughout (`"type": "module"`), so all config files use `export default`.

## Tailwind note

Tailwind runs through Vite's normal PostCSS pipeline (`postcss.config.js` → `tailwindcss` + `autoprefixer`). The `@tailwind` directives live at the top of `src/index.css`, which `src/main.jsx` imports. Utility scanning is driven by the `content` globs in `tailwind.config.js` — if a class only appears in markup that isn't matched there, it gets purged from the build. There is no separate CSS build step or generated CSS file anymore.

## Architecture (all in src/App.jsx)

The entire app is `src/App.jsx` (entry point `src/main.jsx`). Understanding it hinges on two module-level globals and one coordinate scheme:

- `dict` (global object) — the canonical state, NOT React state. Each toggled cell writes `dict[coordString] = true/false`. `StimBox.toggleClass` mutates `dict` directly; component state only drives the cell's color. So the grid's truth lives outside React.
- `text` (global string) — holds the TSV header row, and `App.download()` appends data rows to it on export.

### Coordinate system

Cells are identified by a 6-element coordinate `[chart, column, superCol, superRow, row, col]`, joined with `''` into a `dict` key (e.g. `[1,0,5,1,2,3]` → `"105123"`). All indices are single-digit, which is why the no-separator join works — keep it that way or keys will collide.

The component tree builds these coords top-down: `App` renders four `LRGroup`s (chart 0/1 × column 0=Input / 1=ECout) → each `LRGroup` lays out `StimGroup`s across superRow/superCol → each `StimGroup` renders a 3×4 grid of `StimBox`es. The `group` prop flips justification (left vs right) to mirror the two halves.

### Export ordering — the critical invariant

`App.download()` regenerates `text` from a hardcoded header literal, then walks nested loops `[h][i][j][k][l][m]` to emit a `1`/`0` per cell. **The loop traversal order must exactly match the column order in the header string**, or activations land in the wrong tensor cells. Note the loops count *down* on some axes (`j: 5→0`, `l: 2→0`) to match the header's column sequence — this is intentional, not a bug.

### TSV format gotchas

- The header literal appears **twice** (module top + inside `download()`); they must stay identical.
- Emergent format: first row is `_H:` (header), data rows start with `_D:`, everything tab-separated. Column names like `%Input[4:0,0,0,0]<4:6,2,3,4>` encode the tensor name, index, and (on the first column of each tensor) its `<shape>`. Two tensors are emitted: `Input` and `ECout`, each shape `4:6,2,3,4`.
- Output filename is hardcoded to `test_ab_ps.tsv`.
