import React, { Component } from 'react'
import logo from './logo.svg';
import './tailwind.output.css';
import './App.css';

class StimBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.toggleClass = this.toggleClass.bind(this);
  }
  toggleClass() {
    console.log(this.props.coords)
    const currentState = this.state.active;
    this.setState({ active: !currentState });
  };

  render() {
    return (
      <div
        className={this.state.active ? 'bg-yellow-300 h-6 w-6' : "bg-gray-400 h-6 w-6"}
        onClick={this.toggleClass}
      >
        {/* <p>{this.props.name}</p> */}
      </div>
    )
  }
}

class StimGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      columns: [...Array(4).keys()],
      rows: [...Array(3).keys()]
    };
  }

  render() {
    return (
      <div className="py-2">
        {this.state.rows.map((item, i) =>
        this.props.group ?
          <div className="flex justify-start -mx-1 -my-1">
            {this.state.columns.map((item, j) =>
              <div className="px-1 py-1">
                <StimBox coords={[this.props.column, this.props.xcoord, this.props.ycoord, i, j]} name={i + "," + j} />
              </div>)}
          </div> :
          <div className="flex justify-end -mx-1 -my-1">
          {this.state.columns.map((item, j) =>
            <div className="px-1 py-1">
              <StimBox coords={[this.props.column, this.props.xcoord, this.props.ycoord, i, j]} name={i + "," + j} />
            </div>)}
        </div>
        )}
      </div>
    )
  }
}

class LRGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      columns: [...Array(6).keys()],
      rows: [...Array(2).keys()]
    };
  }

  render() {
    return (
      this.state.rows.map((item, i) =>
        <div className="px-4 py-2 w-1/2">
          {this.state.columns.map((item, j) =>
            <StimGroup column={this.props.column} group={i} xcoord={j} ycoord={i} />
          )}
        </div>
      )
    )
  }
}

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="text-lg">
          TSV configuration
        </div>


        <div className="px-4">
          <div className="flex -mx-4">
            <LRGroup column={0} />
            <LRGroup column={1} />

          </div>
        </div>



        {/* <div className="max-w-sm rounded overflow-hidden shadow-lg">
  
  
        </div> */}
      </div>
    );
  }

}

export default App;
