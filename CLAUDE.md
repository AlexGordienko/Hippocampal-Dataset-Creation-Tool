# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A browser tool for hand-authoring TSV datasets consumed by the [Emergent](https://github.com/emer/emergent) neural simulation framework (used here for hippocampal modeling). The user clicks cells in a grid of pattern boxes to set activations, then exports a `.tsv` whose layout matches Emergent's tensor-column format. There is no backend — everything runs client-side and the export is a generated `Blob` download.

## Commands

- `yarn dev` — Vite dev server with HMR on http://localhost:3000 (opens the browser; port set in `vite.config.js`).
- `yarn build` — production build to `dist/`.
- `yarn preview` — serve the built `dist/` bundle locally.
- `yarn test` — run the Vitest suite once; `yarn test:watch` for watch mode. Run one file with `yarn test src/tsv.test.js`.

Stack: Vite + React 18 (class components) + Tailwind CSS 3, tested with Vitest. ESM throughout (`"type": "module"`), so all config files use `export default`.

## Tailwind note

Tailwind runs through Vite's normal PostCSS pipeline (`postcss.config.js` → `tailwindcss` + `autoprefixer`). The `@tailwind` directives live at the top of `src/index.css`, which `src/main.jsx` imports. Utility scanning is driven by the `content` globs in `tailwind.config.js` — if a class only appears in markup that isn't matched there, it gets purged from the build. There is no separate CSS build step or generated CSS file anymore.

## Architecture

Two files hold the logic: `src/App.jsx` (UI, React state) and `src/tsv.js` (pure TSV generation, no React/DOM — this is what the tests target). Entry point is `src/main.jsx`.

### State and the grid hierarchy

- `App.state.rows` is the list of pattern rows, each `{ name, active }` where `active` is a `{ cellKey: true }` map. One row = one Input/ECout pair = one `_D:` line on export. There is always at least one row. `StimBox` is **controlled**: colour comes from props, clicks call back up to `App.toggle(rowIndex, …)`. No global mutable state.
- Row titles (`Row N`) are positional (derived from index). Default names are `rowName(i)` = `AB_${i}`. **Add** appends `AB_${len}`; **Delete** (shown only on rows after the first) removes a row, then re-sequences any *still-default* name to its new index — custom-edited names are left alone — and pops a 3s snackbar (`App.state.snackbar`). Fill/Clear/Random apply to **every** row.
- Grid dimensions live in `App.state.dims` (`bigGroupRows/Cols`, `smallGroupRows/Cols`), edited via the four number inputs, shared across all rows. Defaults `6/2/3/4` reproduce the original fixed layout.
- Component tree: per row `App` renders two `LRGroup`s (column 0=Input, 1=ECout) → each `LRGroup` lays out `bigGroupCols` side-by-side columns, each stacking `bigGroupRows` `StimGroup`s → each `StimGroup` renders a `smallGroupRows × smallGroupCols` grid of `StimBox`es. The `poolCol` prop flips justification to mirror the two pool columns toward the centre.

### Coordinate system

A cell's **screen** coordinate is `[column, poolRow, poolCol, unitRow, unitCol]`, turned into a key by `cellKey()` which joins with **commas** (`'0,5,1,2,3'`). The comma matters: the original code joined with `''`, which silently collides once any index reaches 10 — exactly what configurable dimensions can produce.

### Export — `src/tsv.js`

`buildHeader`, `buildDataRow`, `buildTsv` (one row) and `buildTsvRows` (many) all derive columns from one ordered list (`tensorCells`), so the header and the data rows can never drift out of sync (the old code kept an 8 KB header literal duplicated in two places — that's gone). `App.download()` uses `buildTsvRows`.

- **Emergent format:** `_H:` header row, `_D:` data row(s), tab-separated. Column names like `%Input[4:a,b,c,d]<4:R,C,r,c>` encode tensor name, the index `[poolRow, poolCol, unitRow, unitCol]`, and (on each tensor's first column) the shape `<4:bigGroupRows,bigGroupCols,smallGroupRows,smallGroupCols>`. Two tensors per row, `Input` then `ECout`, always the same shape.
- **The vertical flip (critical, intentional):** the two vertical axes (`poolRow`, `unitRow`) are flipped between screen-space (y-down) and tensor-space (y-up). `buildDataRow` looks up screen cell `[bigGroupRows-1-a, b, smallGroupRows-1-c, d]` for tensor index `[a,b,c,d]`. This reproduces the original tool's descending `j:5→0` / `l:2→0` loops; drop it and saved patterns export upside-down.
- One `_D:` line is emitted per row in `App.state.rows` (in order), each tagged with that row's `name`. Output filename is hardcoded to `test_ab_ps.tsv`.

### Tests (`src/tsv.test.js`)

Regression-locks the export to the original behaviour: `buildHeader(DEFAULT_DIMS)` is compared byte-for-byte against `src/__fixtures__/legacyHeader.txt` (extracted verbatim from the pre-refactor code), and `buildDataRow` is diffed against a faithful copy of the original `download()` loop across several activation patterns. Also covers dimension-driven column counts and the multi-digit key-collision fix. **If you change export logic, these must still pass** — they are the guarantee that output stays compatible.
