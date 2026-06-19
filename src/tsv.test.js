import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  DEFAULT_DIMS,
  TENSORS,
  buildHeader,
  buildDataRow,
  buildTsv,
  buildTsvRows,
  tensorCells,
  screenCells,
  cellKey,
} from './tsv.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const legacyHeader = fs.readFileSync(
  path.join(here, '__fixtures__', 'legacyHeader.txt'),
  'utf8'
);

// ---------------------------------------------------------------------------
// Oracle: a faithful copy of the ORIGINAL download() inner loop (chart 0 only),
// so we can prove the refactored generator reproduces the old output exactly.
// `isActive(column, xcoord, ycoord, smallRow, smallCol)` uses screen coords,
// identical in meaning to the new isActive signature.
// ---------------------------------------------------------------------------
function legacyDataRow(isActive) {
  let row = '_D:\tAB_0';
  for (let i = 0; i < 2; i++) {            // input vs ecout (column)
    for (let j = 5; j >= 0; j--) {         // xcoord (poolRow), descending
      for (let k = 0; k < 2; k++) {        // ycoord (poolCol)
        for (let l = 2; l >= 0; l--) {     // smallRow (unitRow), descending
          for (let m = 0; m < 4; m++) {    // smallCol (unitCol)
            row += isActive(i, j, k, l, m) ? '\t1' : '\t0';
          }
        }
      }
    }
  }
  return row;
}

// Every screen coordinate in the default-shaped grid.
function defaultScreenCells() {
  const cells = [];
  for (let i = 0; i < 2; i++)
    for (let j = 0; j < 6; j++)
      for (let k = 0; k < 2; k++)
        for (let l = 0; l < 3; l++)
          for (let m = 0; m < 4; m++) cells.push([i, j, k, l, m]);
  return cells;
}

const keyOf = (c) => c.join(',');
const activeFnFrom = (set) => (...coord) => set.has(keyOf(coord));

describe('buildHeader', () => {
  it('reproduces the legacy header byte-for-byte at default dims', () => {
    expect(buildHeader(DEFAULT_DIMS)).toBe(legacyHeader);
  });

  it('emits the shape annotation on the first cell of each tensor', () => {
    const cols = buildHeader(DEFAULT_DIMS).split('\t');
    expect(cols.filter((c) => c.includes('<4:6,2,3,4>'))).toHaveLength(2);
  });

  it('column count tracks the configured dimensions', () => {
    const dims = { bigGroupRows: 5, bigGroupCols: 3, smallGroupRows: 2, smallGroupCols: 7 };
    const perTensor = 5 * 3 * 2 * 7;
    const cols = buildHeader(dims).split('\t');
    expect(cols).toHaveLength(2 + TENSORS.length * perTensor); // _H: + $Name + cells
  });
});

describe('buildDataRow matches the legacy export at default dims', () => {
  const cases = {
    empty: new Set(),
    full: new Set(defaultScreenCells().map(keyOf)),
    corners: new Set([
      [0, 0, 0, 0, 0],
      [0, 5, 1, 2, 3],
      [1, 0, 0, 0, 0],
      [1, 5, 1, 2, 3],
    ].map(keyOf)),
  };

  // a deterministic pseudo-random pattern (no test flakiness)
  const pseudo = new Set(
    defaultScreenCells().filter((_, idx) => (idx * 7 + 3) % 5 === 0).map(keyOf)
  );
  cases.pseudoRandom = pseudo;

  for (const [name, set] of Object.entries(cases)) {
    it(name, () => {
      const isActive = activeFnFrom(set);
      expect(buildDataRow('AB_0', isActive, DEFAULT_DIMS)).toBe(
        legacyDataRow(isActive)
      );
    });
  }
});

describe('buildTsv', () => {
  it('is the header and a single data row joined by a newline', () => {
    const set = new Set([[0, 2, 1, 1, 2]].map(keyOf));
    const isActive = activeFnFrom(set);
    expect(buildTsv('AB_0', isActive, DEFAULT_DIMS)).toBe(
      `${legacyHeader}\n${legacyDataRow(isActive)}`
    );
  });
});

describe('buildTsvRows (multiple Input/ECout rows)', () => {
  it('emits one shared header and one _D: line per row, in order', () => {
    const set0 = new Set([[0, 2, 1, 1, 2]].map(keyOf));
    const set1 = new Set([[1, 0, 0, 0, 0]].map(keyOf));
    const rows = [
      { name: 'AB_0', isActive: activeFnFrom(set0) },
      { name: 'AB_1', isActive: activeFnFrom(set1) },
    ];
    const out = buildTsvRows(rows, DEFAULT_DIMS).split('\n');
    expect(out).toHaveLength(3); // header + 2 data rows
    expect(out[0]).toBe(legacyHeader);
    expect(out[1]).toBe(legacyDataRow(rows[0].isActive));
    expect(out[2].split('\t').slice(0, 2)).toEqual(['_D:', 'AB_1']);
  });

  it('a single row matches buildTsv', () => {
    const set = new Set([[0, 3, 0, 1, 1]].map(keyOf));
    const isActive = activeFnFrom(set);
    expect(buildTsvRows([{ name: 'AB_0', isActive }], DEFAULT_DIMS)).toBe(
      buildTsv('AB_0', isActive, DEFAULT_DIMS)
    );
  });
});

describe('screenCells (Fill/Clear/Random source)', () => {
  it('enumerates every cell across both tensors with unique keys', () => {
    const dims = { bigGroupRows: 6, bigGroupCols: 2, smallGroupRows: 3, smallGroupCols: 4 };
    const cells = screenCells(dims);
    expect(cells).toHaveLength(TENSORS.length * 6 * 2 * 3 * 4); // 288
    const keys = new Set(cells.map((c) => cellKey(...c)));
    expect(keys.size).toBe(cells.length); // no collisions
  });

  it('a "fill" map marks exactly one column active per cell', () => {
    const active = {};
    for (const coord of screenCells(DEFAULT_DIMS)) active[cellKey(...coord)] = true;
    const isActive = (...coord) => !!active[cellKey(...coord)];
    const values = buildDataRow('AB_0', isActive, DEFAULT_DIMS).split('\t').slice(2);
    expect(values.every((v) => v === '1')).toBe(true);
  });
});

describe('multi-digit dimensions do not collide (regression for join())', () => {
  it('places a single activation in exactly one column', () => {
    const dims = { bigGroupRows: 12, bigGroupCols: 1, smallGroupRows: 1, smallGroupCols: 11 };
    // activate screen cell tensor0 poolRow=11 unitCol=10 (both two-digit)
    const target = keyOf([0, 11, 0, 0, 10]);
    const isActive = (...coord) => keyOf(coord) === target;
    const values = buildDataRow('AB_0', isActive, dims)
      .split('\t')
      .slice(2); // drop "_D:" and name
    expect(values.filter((v) => v === '1')).toHaveLength(1);
    expect(values).toHaveLength(TENSORS.length * 12 * 1 * 1 * 11);
  });
});
