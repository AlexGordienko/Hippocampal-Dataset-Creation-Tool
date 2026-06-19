import React, { Component } from 'react';
import { DEFAULT_DIMS, DIM_FIELDS, rowName, cellKey, buildTsvRows, screenCells } from './tsv';

const range = (n) => [...Array(Math.max(0, n)).keys()];

// A single toggleable cell. Controlled: colour comes from props, clicks bubble up.
class StimBox extends Component {
  render() {
    const { active, onToggle } = this.props;
    return (
      <div
        className={active ? 'bg-yellow-300 h-6 w-6' : 'bg-gray-400 h-6 w-6'}
        onClick={onToggle}
      />
    );
  }
}

// One small group: smallGroupRows x smallGroupCols cells.
class StimGroup extends Component {
  render() {
    const { column, poolRow, poolCol, smallGroupRows, smallGroupCols, isActive, onToggle } = this.props;
    // Mirror the two pool columns toward the centre (matches the original layout).
    const justify = poolCol ? 'justify-start' : 'justify-end';
    return (
      <div className="py-2">
        {range(smallGroupRows).map((unitRow) => (
          <div key={unitRow} className={`flex ${justify} -mx-1 -my-1`}>
            {range(smallGroupCols).map((unitCol) => (
              <div key={unitCol} className="px-1 py-1">
                <StimBox
                  active={isActive(column, poolRow, poolCol, unitRow, unitCol)}
                  onToggle={() => onToggle(column, poolRow, poolCol, unitRow, unitCol)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

// One tensor panel (Input or EC Out): bigGroupRows x bigGroupCols small groups,
// laid out as bigGroupCols side-by-side columns each stacking bigGroupRows groups.
class LRGroup extends Component {
  render() {
    const { column, dims, isActive, onToggle } = this.props;
    const { bigGroupRows, bigGroupCols, smallGroupRows, smallGroupCols } = dims;
    return (
      <div className="flex">
        {range(bigGroupCols).map((poolCol) => (
          <div key={poolCol} className="px-4 py-2">
            {range(bigGroupRows).map((poolRow) => (
              <StimGroup
                key={poolRow}
                column={column}
                poolRow={poolRow}
                poolCol={poolCol}
                smallGroupRows={smallGroupRows}
                smallGroupCols={smallGroupCols}
                isActive={isActive}
                onToggle={onToggle}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

const emptyRow = (index) => ({ name: rowName(index), active: {} });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dims: { ...DEFAULT_DIMS },
      rows: [emptyRow(0)], // each row: { name, active: { cellKey: true } }
      snackbar: null,
    };
    this.setDim = this.setDim.bind(this);
    this.fill = this.fill.bind(this);
    this.clear = this.clear.bind(this);
    this.randomize = this.randomize.bind(this);
    this.addRow = this.addRow.bind(this);
    this.download = this.download.bind(this);
    this.snackbarTimer = null;
  }

  componentWillUnmount() {
    clearTimeout(this.snackbarTimer);
  }

  isActive(rowIndex, column, poolRow, poolCol, unitRow, unitCol) {
    return !!this.state.rows[rowIndex].active[cellKey(column, poolRow, poolCol, unitRow, unitCol)];
  }

  toggle(rowIndex, column, poolRow, poolCol, unitRow, unitCol) {
    const key = cellKey(column, poolRow, poolCol, unitRow, unitCol);
    this.setState((s) => ({
      rows: s.rows.map((r, i) =>
        i === rowIndex ? { ...r, active: { ...r.active, [key]: !r.active[key] } } : r
      ),
    }));
  }

  setName(rowIndex, value) {
    this.setState((s) => ({
      rows: s.rows.map((r, i) => (i === rowIndex ? { ...r, name: value } : r)),
    }));
  }

  setDim(name, value) {
    const n = Math.max(1, parseInt(value, 10) || 1);
    this.setState((s) => ({ dims: { ...s.dims, [name]: n } }));
  }

  // Fill/Clear/Random apply to every row.
  fill() {
    this.setState((s) => {
      const all = {};
      for (const coord of screenCells(s.dims)) all[cellKey(...coord)] = true;
      return { rows: s.rows.map((r) => ({ ...r, active: { ...all } })) };
    });
  }

  clear() {
    this.setState((s) => ({ rows: s.rows.map((r) => ({ ...r, active: {} })) }));
  }

  randomize() {
    this.setState((s) => ({
      rows: s.rows.map((r) => {
        const active = {};
        for (const coord of screenCells(s.dims)) {
          // 1/3 activation probability to keep patterns sparse
          if (Math.random() < 1 / 3) active[cellKey(...coord)] = true;
        }
        return { ...r, active };
      }),
    }));
  }

  addRow() {
    this.setState((s) => ({ rows: [...s.rows, emptyRow(s.rows.length)] }));
  }

  deleteRow(rowIndex) {
    if (this.state.rows.length <= 1) return; // always keep at least one row
    const deletedTitle = `Row ${rowIndex}`;
    this.setState((s) => {
      const rows = s.rows
        .filter((_, i) => i !== rowIndex)
        .map((r, newIndex) => {
          // Rows after the deleted one shift up by one; if a row still carries its
          // positional default name, re-sequence it (custom names are left alone).
          const oldIndex = newIndex >= rowIndex ? newIndex + 1 : newIndex;
          return r.name === rowName(oldIndex) ? { ...r, name: rowName(newIndex) } : r;
        });
      return { rows };
    });
    this.showSnackbar(`${deletedTitle} deleted`);
  }

  showSnackbar(message) {
    clearTimeout(this.snackbarTimer);
    this.setState({ snackbar: message });
    this.snackbarTimer = setTimeout(() => this.setState({ snackbar: null }), 3000);
  }

  download() {
    const { rows, dims } = this.state;
    const text = buildTsvRows(
      rows.map((r) => ({
        name: r.name,
        isActive: (...coord) => !!r.active[cellKey(...coord)],
      })),
      dims
    );
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/tab-separated-values' });
    element.href = URL.createObjectURL(file);
    element.download = 'test_ab_ps.tsv';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  renderRow(row, index) {
    const { dims } = this.state;
    return (
      <div className="relative border border-gray-300 rounded-lg p-6">
        {index > 0 && (
          <button
            onClick={() => this.deleteRow(index)}
            className="absolute top-3 right-3 bg-red-100 hover:bg-red-200 text-red-800 font-bold py-1 px-4 rounded"
          >
            Delete
          </button>
        )}
        <label className="flex flex-col items-center text-sm mb-4">
          <span className="mb-1">Row {index}</span>
          <input
            type="text"
            value={row.name}
            onChange={(e) => this.setName(index, e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-40 text-center"
          />
        </label>
        <div className="flex justify-center gap-x-8">
          <div className="bg-gray-100 rounded-lg p-4">
            <p>Input</p>
            <LRGroup
              column={0}
              dims={dims}
              isActive={(...c) => this.isActive(index, ...c)}
              onToggle={(...c) => this.toggle(index, ...c)}
            />
          </div>
          <div className="p-4">
            <p>EC Out</p>
            <LRGroup
              column={1}
              dims={dims}
              isActive={(...c) => this.isActive(index, ...c)}
              onToggle={(...c) => this.toggle(index, ...c)}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { dims, rows, snackbar } = this.state;
    return (
      <div className="App">
        <header className="max-w-2xl mx-auto px-4 pt-8 pb-6 mb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Emergent Input Builder</h1>
          <p className="mt-3 text-gray-600">
            Visually build Input and EC&nbsp;Out activation patterns for the{' '}
            <a
              href="https://github.com/emer/emergent"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Emergent
            </a>{' '}
            neural simulation framework and export them as a ready-to-load{' '}
            <code className="px-1 bg-gray-100 rounded text-sm">.tsv</code> dataset. Note: this project is not affiliated with the official Emergent project, but I did find it helpful to visual what the model sees. Furthermore, this was built specifically for the Hippocampus simulation, though can likely be used more abstractly.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Set the grid dimensions, then click cells to switch units on. Use{' '}
            <span className="font-medium">Fill</span>,{' '}
            <span className="font-medium">Clear</span>, or{' '}
            <span className="font-medium">Random</span> to seed a pattern. Each row is
            one input event — <span className="font-medium">Add</span> rows for more
            patterns, name each one, then{' '}
            <span className="font-medium">Download&nbsp;.tsv</span>.
          </p>
        </header>

        <div className="flex justify-center gap-x-4 my-4">
          {DIM_FIELDS.map(({ key, label }) => (
            <label key={key} className="flex flex-col items-center text-sm">
              <span className="mb-1">{label}</span>
              <input
                type="number"
                min="1"
                value={dims[key]}
                onChange={(e) => this.setDim(key, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 w-20 text-center"
              />
            </label>
          ))}
        </div>

        <div className="flex justify-center my-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-x-2">
                <button onClick={this.fill} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-4 rounded">Fill</button>
                <button onClick={this.clear} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-4 rounded">Clear</button>
                <button onClick={this.randomize} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-4 rounded">Random</button>
              </div>
              <button onClick={this.download} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                <span>Download .tsv</span>
              </button>
            </div>

            {rows.map((row, index) => (
              <div key={index} className={index > 0 ? 'mt-6' : ''}>
                {this.renderRow(row, index)}
              </div>
            ))}

            <div className="flex justify-center mt-6">
              <button onClick={this.addRow} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-4 rounded">Add</button>
            </div>
          </div>
        </div>

        {snackbar && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-4 py-2 rounded shadow-lg">
            {snackbar}
          </div>
        )}
      </div>
    );
  }
}

export default App;
