// Pure helpers for building the Emergent TSV. No React / DOM here so the export
// logic can be unit-tested in isolation.
//
// Coordinate model (per tensor): a 4-level hierarchy laid out as
//   big group  = bigGroupRows x bigGroupCols  small groups
//   small group = smallGroupRows x smallGroupCols cells
//
// Emergent tensor index for a cell is [a, b, c, d] = [poolRow, poolCol, unitRow, unitCol]
// and the shape annotation is <4:bigGroupRows,bigGroupCols,smallGroupRows,smallGroupCols>.
//
// Screen vs tensor: the two *vertical* axes (poolRow, unitRow) are flipped between
// screen-space (y-down, row 0 at the top) and tensor-space (y-up, index 0 at the
// bottom). This matches the original tool and must be preserved, or saved patterns
// export upside-down.

export const TENSORS = ['Input', 'ECout'];

// Default $Name for the row at a given index ("AB_0", "AB_1", ...).
export const rowName = (index) => `AB_${index}`;

// Default $Name value for the first exported data row.
export const DEFAULT_NAME = rowName(0);

export const DEFAULT_DIMS = {
  bigGroupRows: 6,
  bigGroupCols: 2,
  smallGroupRows: 3,
  smallGroupCols: 4,
};

// The four editable fields, in display order.
export const DIM_FIELDS = [
  { key: 'bigGroupRows', label: 'Big group rows' },
  { key: 'bigGroupCols', label: 'Big group columns' },
  { key: 'smallGroupRows', label: 'Small group rows' },
  { key: 'smallGroupCols', label: 'Small group columns' },
];

// Activation key for one cell, by SCREEN coordinate within a tensor.
// Comma-delimited so multi-digit indices can never collide (the original join('')
// broke as soon as any index reached 10).
export function cellKey(tensorIndex, poolRow, poolCol, unitRow, unitCol) {
  return [tensorIndex, poolRow, poolCol, unitRow, unitCol].join(',');
}

// Ordered tensor-index cells [a, b, c, d] for one tensor, in header order
// (poolRow outer -> unitCol inner, all ascending).
export function tensorCells(dims) {
  const { bigGroupRows, bigGroupCols, smallGroupRows, smallGroupCols } = dims;
  const cells = [];
  for (let a = 0; a < bigGroupRows; a++) {
    for (let b = 0; b < bigGroupCols; b++) {
      for (let c = 0; c < smallGroupRows; c++) {
        for (let d = 0; d < smallGroupCols; d++) {
          cells.push([a, b, c, d]);
        }
      }
    }
  }
  return cells;
}

// Every cell's SCREEN coordinate [column, poolRow, poolCol, unitRow, unitCol]
// across both tensors, for the given dims. Used by the Fill/Clear/Random actions.
export function screenCells(dims) {
  const { bigGroupRows, bigGroupCols, smallGroupRows, smallGroupCols } = dims;
  const cells = [];
  for (let column = 0; column < TENSORS.length; column++) {
    for (let poolRow = 0; poolRow < bigGroupRows; poolRow++) {
      for (let poolCol = 0; poolCol < bigGroupCols; poolCol++) {
        for (let unitRow = 0; unitRow < smallGroupRows; unitRow++) {
          for (let unitCol = 0; unitCol < smallGroupCols; unitCol++) {
            cells.push([column, poolRow, poolCol, unitRow, unitCol]);
          }
        }
      }
    }
  }
  return cells;
}

export function buildHeader(dims) {
  const { bigGroupRows, bigGroupCols, smallGroupRows, smallGroupCols } = dims;
  const shape = `<4:${bigGroupRows},${bigGroupCols},${smallGroupRows},${smallGroupCols}>`;
  const cells = tensorCells(dims);
  let header = '_H:\t$Name';
  for (const tensor of TENSORS) {
    cells.forEach(([a, b, c, d], idx) => {
      header += `\t%${tensor}[4:${a},${b},${c},${d}]`;
      if (idx === 0) header += shape;
    });
  }
  return header;
}

// `isActive(tensorIndex, poolRow, poolCol, unitRow, unitCol)` -> boolean,
// queried with SCREEN coordinates.
export function buildDataRow(name, isActive, dims) {
  const { bigGroupRows, smallGroupRows } = dims;
  const cells = tensorCells(dims);
  let row = `_D:\t${name}`;
  TENSORS.forEach((_, tensorIndex) => {
    for (const [a, b, c, d] of cells) {
      const poolRow = bigGroupRows - 1 - a; // vertical flip
      const unitRow = smallGroupRows - 1 - c; // vertical flip
      row += isActive(tensorIndex, poolRow, b, unitRow, d) ? '\t1' : '\t0';
    }
  });
  return row;
}

export function buildTsv(name, isActive, dims) {
  return `${buildHeader(dims)}\n${buildDataRow(name, isActive, dims)}`;
}

// `rows` is an array of { name, isActive } — one `_D:` line per row, sharing one header.
export function buildTsvRows(rows, dims) {
  const lines = [buildHeader(dims)];
  for (const { name, isActive } of rows) {
    lines.push(buildDataRow(name, isActive, dims));
  }
  return lines.join('\n');
}
