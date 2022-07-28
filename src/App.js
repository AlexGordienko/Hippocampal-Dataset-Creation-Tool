import React, { Component } from 'react';
import CSV from 'csv-lite-js';
import logo from './logo.svg';
import './tailwind.output.css';
import './App.css';
import { CSVLink, CSVDownload } from "react-csv";

// initialize with headers
let text = "_H:	$Name	%Input[4:0,0,0,0]<4:6,2,3,4>	%Input[4:0,0,0,1]	%Input[4:0,0,0,2]	%Input[4:0,0,0,3]	%Input[4:0,0,1,0]	%Input[4:0,0,1,1]	%Input[4:0,0,1,2]	%Input[4:0,0,1,3]	%Input[4:0,0,2,0]	%Input[4:0,0,2,1]	%Input[4:0,0,2,2]	%Input[4:0,0,2,3]	%Input[4:0,1,0,0]	%Input[4:0,1,0,1]	%Input[4:0,1,0,2]	%Input[4:0,1,0,3]	%Input[4:0,1,1,0]	%Input[4:0,1,1,1]	%Input[4:0,1,1,2]	%Input[4:0,1,1,3]	%Input[4:0,1,2,0]	%Input[4:0,1,2,1]	%Input[4:0,1,2,2]	%Input[4:0,1,2,3]	%Input[4:1,0,0,0]	%Input[4:1,0,0,1]	%Input[4:1,0,0,2]	%Input[4:1,0,0,3]	%Input[4:1,0,1,0]	%Input[4:1,0,1,1]	%Input[4:1,0,1,2]	%Input[4:1,0,1,3]	%Input[4:1,0,2,0]	%Input[4:1,0,2,1]	%Input[4:1,0,2,2]	%Input[4:1,0,2,3]	%Input[4:1,1,0,0]	%Input[4:1,1,0,1]	%Input[4:1,1,0,2]	%Input[4:1,1,0,3]	%Input[4:1,1,1,0]	%Input[4:1,1,1,1]	%Input[4:1,1,1,2]	%Input[4:1,1,1,3]	%Input[4:1,1,2,0]	%Input[4:1,1,2,1]	%Input[4:1,1,2,2]	%Input[4:1,1,2,3]	%Input[4:2,0,0,0]	%Input[4:2,0,0,1]	%Input[4:2,0,0,2]	%Input[4:2,0,0,3]	%Input[4:2,0,1,0]	%Input[4:2,0,1,1]	%Input[4:2,0,1,2]	%Input[4:2,0,1,3]	%Input[4:2,0,2,0]	%Input[4:2,0,2,1]	%Input[4:2,0,2,2]	%Input[4:2,0,2,3]	%Input[4:2,1,0,0]	%Input[4:2,1,0,1]	%Input[4:2,1,0,2]	%Input[4:2,1,0,3]	%Input[4:2,1,1,0]	%Input[4:2,1,1,1]	%Input[4:2,1,1,2]	%Input[4:2,1,1,3]	%Input[4:2,1,2,0]	%Input[4:2,1,2,1]	%Input[4:2,1,2,2]	%Input[4:2,1,2,3]	%Input[4:3,0,0,0]	%Input[4:3,0,0,1]	%Input[4:3,0,0,2]	%Input[4:3,0,0,3]	%Input[4:3,0,1,0]	%Input[4:3,0,1,1]	%Input[4:3,0,1,2]	%Input[4:3,0,1,3]	%Input[4:3,0,2,0]	%Input[4:3,0,2,1]	%Input[4:3,0,2,2]	%Input[4:3,0,2,3]	%Input[4:3,1,0,0]	%Input[4:3,1,0,1]	%Input[4:3,1,0,2]	%Input[4:3,1,0,3]	%Input[4:3,1,1,0]	%Input[4:3,1,1,1]	%Input[4:3,1,1,2]	%Input[4:3,1,1,3]	%Input[4:3,1,2,0]	%Input[4:3,1,2,1]	%Input[4:3,1,2,2]	%Input[4:3,1,2,3]	%Input[4:4,0,0,0]	%Input[4:4,0,0,1]	%Input[4:4,0,0,2]	%Input[4:4,0,0,3]	%Input[4:4,0,1,0]	%Input[4:4,0,1,1]	%Input[4:4,0,1,2]	%Input[4:4,0,1,3]	%Input[4:4,0,2,0]	%Input[4:4,0,2,1]	%Input[4:4,0,2,2]	%Input[4:4,0,2,3]	%Input[4:4,1,0,0]	%Input[4:4,1,0,1]	%Input[4:4,1,0,2]	%Input[4:4,1,0,3]	%Input[4:4,1,1,0]	%Input[4:4,1,1,1]	%Input[4:4,1,1,2]	%Input[4:4,1,1,3]	%Input[4:4,1,2,0]	%Input[4:4,1,2,1]	%Input[4:4,1,2,2]	%Input[4:4,1,2,3]	%Input[4:5,0,0,0]	%Input[4:5,0,0,1]	%Input[4:5,0,0,2]	%Input[4:5,0,0,3]	%Input[4:5,0,1,0]	%Input[4:5,0,1,1]	%Input[4:5,0,1,2]	%Input[4:5,0,1,3]	%Input[4:5,0,2,0]	%Input[4:5,0,2,1]	%Input[4:5,0,2,2]	%Input[4:5,0,2,3]	%Input[4:5,1,0,0]	%Input[4:5,1,0,1]	%Input[4:5,1,0,2]	%Input[4:5,1,0,3]	%Input[4:5,1,1,0]	%Input[4:5,1,1,1]	%Input[4:5,1,1,2]	%Input[4:5,1,1,3]	%Input[4:5,1,2,0]	%Input[4:5,1,2,1]	%Input[4:5,1,2,2]	%Input[4:5,1,2,3]	%ECout[4:0,0,0,0]<4:6,2,3,4>	%ECout[4:0,0,0,1]	%ECout[4:0,0,0,2]	%ECout[4:0,0,0,3]	%ECout[4:0,0,1,0]	%ECout[4:0,0,1,1]	%ECout[4:0,0,1,2]	%ECout[4:0,0,1,3]	%ECout[4:0,0,2,0]	%ECout[4:0,0,2,1]	%ECout[4:0,0,2,2]	%ECout[4:0,0,2,3]	%ECout[4:0,1,0,0]	%ECout[4:0,1,0,1]	%ECout[4:0,1,0,2]	%ECout[4:0,1,0,3]	%ECout[4:0,1,1,0]	%ECout[4:0,1,1,1]	%ECout[4:0,1,1,2]	%ECout[4:0,1,1,3]	%ECout[4:0,1,2,0]	%ECout[4:0,1,2,1]	%ECout[4:0,1,2,2]	%ECout[4:0,1,2,3]	%ECout[4:1,0,0,0]	%ECout[4:1,0,0,1]	%ECout[4:1,0,0,2]	%ECout[4:1,0,0,3]	%ECout[4:1,0,1,0]	%ECout[4:1,0,1,1]	%ECout[4:1,0,1,2]	%ECout[4:1,0,1,3]	%ECout[4:1,0,2,0]	%ECout[4:1,0,2,1]	%ECout[4:1,0,2,2]	%ECout[4:1,0,2,3]	%ECout[4:1,1,0,0]	%ECout[4:1,1,0,1]	%ECout[4:1,1,0,2]	%ECout[4:1,1,0,3]	%ECout[4:1,1,1,0]	%ECout[4:1,1,1,1]	%ECout[4:1,1,1,2]	%ECout[4:1,1,1,3]	%ECout[4:1,1,2,0]	%ECout[4:1,1,2,1]	%ECout[4:1,1,2,2]	%ECout[4:1,1,2,3]	%ECout[4:2,0,0,0]	%ECout[4:2,0,0,1]	%ECout[4:2,0,0,2]	%ECout[4:2,0,0,3]	%ECout[4:2,0,1,0]	%ECout[4:2,0,1,1]	%ECout[4:2,0,1,2]	%ECout[4:2,0,1,3]	%ECout[4:2,0,2,0]	%ECout[4:2,0,2,1]	%ECout[4:2,0,2,2]	%ECout[4:2,0,2,3]	%ECout[4:2,1,0,0]	%ECout[4:2,1,0,1]	%ECout[4:2,1,0,2]	%ECout[4:2,1,0,3]	%ECout[4:2,1,1,0]	%ECout[4:2,1,1,1]	%ECout[4:2,1,1,2]	%ECout[4:2,1,1,3]	%ECout[4:2,1,2,0]	%ECout[4:2,1,2,1]	%ECout[4:2,1,2,2]	%ECout[4:2,1,2,3]	%ECout[4:3,0,0,0]	%ECout[4:3,0,0,1]	%ECout[4:3,0,0,2]	%ECout[4:3,0,0,3]	%ECout[4:3,0,1,0]	%ECout[4:3,0,1,1]	%ECout[4:3,0,1,2]	%ECout[4:3,0,1,3]	%ECout[4:3,0,2,0]	%ECout[4:3,0,2,1]	%ECout[4:3,0,2,2]	%ECout[4:3,0,2,3]	%ECout[4:3,1,0,0]	%ECout[4:3,1,0,1]	%ECout[4:3,1,0,2]	%ECout[4:3,1,0,3]	%ECout[4:3,1,1,0]	%ECout[4:3,1,1,1]	%ECout[4:3,1,1,2]	%ECout[4:3,1,1,3]	%ECout[4:3,1,2,0]	%ECout[4:3,1,2,1]	%ECout[4:3,1,2,2]	%ECout[4:3,1,2,3]	%ECout[4:4,0,0,0]	%ECout[4:4,0,0,1]	%ECout[4:4,0,0,2]	%ECout[4:4,0,0,3]	%ECout[4:4,0,1,0]	%ECout[4:4,0,1,1]	%ECout[4:4,0,1,2]	%ECout[4:4,0,1,3]	%ECout[4:4,0,2,0]	%ECout[4:4,0,2,1]	%ECout[4:4,0,2,2]	%ECout[4:4,0,2,3]	%ECout[4:4,1,0,0]	%ECout[4:4,1,0,1]	%ECout[4:4,1,0,2]	%ECout[4:4,1,0,3]	%ECout[4:4,1,1,0]	%ECout[4:4,1,1,1]	%ECout[4:4,1,1,2]	%ECout[4:4,1,1,3]	%ECout[4:4,1,2,0]	%ECout[4:4,1,2,1]	%ECout[4:4,1,2,2]	%ECout[4:4,1,2,3]	%ECout[4:5,0,0,0]	%ECout[4:5,0,0,1]	%ECout[4:5,0,0,2]	%ECout[4:5,0,0,3]	%ECout[4:5,0,1,0]	%ECout[4:5,0,1,1]	%ECout[4:5,0,1,2]	%ECout[4:5,0,1,3]	%ECout[4:5,0,2,0]	%ECout[4:5,0,2,1]	%ECout[4:5,0,2,2]	%ECout[4:5,0,2,3]	%ECout[4:5,1,0,0]	%ECout[4:5,1,0,1]	%ECout[4:5,1,0,2]	%ECout[4:5,1,0,3]	%ECout[4:5,1,1,0]	%ECout[4:5,1,1,1]	%ECout[4:5,1,1,2]	%ECout[4:5,1,1,3]	%ECout[4:5,1,2,0]	%ECout[4:5,1,2,1]	%ECout[4:5,1,2,2]	%ECout[4:5,1,2,3]"
let dict = {}
const separator = "\t"

class StimBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.toggleClass = this.toggleClass.bind(this);
  }
  toggleClass() {
    let coordString = this.props.coords.join('')
    dict[coordString] = !!!this.state.active // t/f conversion or crazy good chess move?
    console.log(dict)
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
                  <StimBox coords={[this.props.chart, this.props.column, this.props.xcoord, this.props.ycoord, i, j]} name={i + "," + j} />
                </div>)}
            </div> :
            <div className="flex justify-end -mx-1 -my-1">
              {this.state.columns.map((item, j) =>
                <div className="px-1 py-1">
                  <StimBox coords={[this.props.chart, this.props.column, this.props.xcoord, this.props.ycoord, i, j]} name={i + "," + j} />
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

        <>
          <div className="px-4 py-2 w-1/2">
            {this.state.columns.map((item, j) =>
              <StimGroup chart={this.props.chart} column={this.props.column} group={i} xcoord={j} ycoord={i} />
            )}
          </div>
        </>

      )

    )
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.download = this.download.bind(this);
  }
  download() {
    CSV.options.delimiter = "\t";
    // text = CSV.stringify([[1,2,3],[4,5,6]])
    console.log(text)

    // iterate through all nodes in order
    // [xi,j,k,l,m]
    // nested for loops are never the best solutions, but there aren't enough nodes to stress the system

    text = "_H:	$Name	%Input[4:0,0,0,0]<4:6,2,3,4>	%Input[4:0,0,0,1]	%Input[4:0,0,0,2]	%Input[4:0,0,0,3]	%Input[4:0,0,1,0]	%Input[4:0,0,1,1]	%Input[4:0,0,1,2]	%Input[4:0,0,1,3]	%Input[4:0,0,2,0]	%Input[4:0,0,2,1]	%Input[4:0,0,2,2]	%Input[4:0,0,2,3]	%Input[4:0,1,0,0]	%Input[4:0,1,0,1]	%Input[4:0,1,0,2]	%Input[4:0,1,0,3]	%Input[4:0,1,1,0]	%Input[4:0,1,1,1]	%Input[4:0,1,1,2]	%Input[4:0,1,1,3]	%Input[4:0,1,2,0]	%Input[4:0,1,2,1]	%Input[4:0,1,2,2]	%Input[4:0,1,2,3]	%Input[4:1,0,0,0]	%Input[4:1,0,0,1]	%Input[4:1,0,0,2]	%Input[4:1,0,0,3]	%Input[4:1,0,1,0]	%Input[4:1,0,1,1]	%Input[4:1,0,1,2]	%Input[4:1,0,1,3]	%Input[4:1,0,2,0]	%Input[4:1,0,2,1]	%Input[4:1,0,2,2]	%Input[4:1,0,2,3]	%Input[4:1,1,0,0]	%Input[4:1,1,0,1]	%Input[4:1,1,0,2]	%Input[4:1,1,0,3]	%Input[4:1,1,1,0]	%Input[4:1,1,1,1]	%Input[4:1,1,1,2]	%Input[4:1,1,1,3]	%Input[4:1,1,2,0]	%Input[4:1,1,2,1]	%Input[4:1,1,2,2]	%Input[4:1,1,2,3]	%Input[4:2,0,0,0]	%Input[4:2,0,0,1]	%Input[4:2,0,0,2]	%Input[4:2,0,0,3]	%Input[4:2,0,1,0]	%Input[4:2,0,1,1]	%Input[4:2,0,1,2]	%Input[4:2,0,1,3]	%Input[4:2,0,2,0]	%Input[4:2,0,2,1]	%Input[4:2,0,2,2]	%Input[4:2,0,2,3]	%Input[4:2,1,0,0]	%Input[4:2,1,0,1]	%Input[4:2,1,0,2]	%Input[4:2,1,0,3]	%Input[4:2,1,1,0]	%Input[4:2,1,1,1]	%Input[4:2,1,1,2]	%Input[4:2,1,1,3]	%Input[4:2,1,2,0]	%Input[4:2,1,2,1]	%Input[4:2,1,2,2]	%Input[4:2,1,2,3]	%Input[4:3,0,0,0]	%Input[4:3,0,0,1]	%Input[4:3,0,0,2]	%Input[4:3,0,0,3]	%Input[4:3,0,1,0]	%Input[4:3,0,1,1]	%Input[4:3,0,1,2]	%Input[4:3,0,1,3]	%Input[4:3,0,2,0]	%Input[4:3,0,2,1]	%Input[4:3,0,2,2]	%Input[4:3,0,2,3]	%Input[4:3,1,0,0]	%Input[4:3,1,0,1]	%Input[4:3,1,0,2]	%Input[4:3,1,0,3]	%Input[4:3,1,1,0]	%Input[4:3,1,1,1]	%Input[4:3,1,1,2]	%Input[4:3,1,1,3]	%Input[4:3,1,2,0]	%Input[4:3,1,2,1]	%Input[4:3,1,2,2]	%Input[4:3,1,2,3]	%Input[4:4,0,0,0]	%Input[4:4,0,0,1]	%Input[4:4,0,0,2]	%Input[4:4,0,0,3]	%Input[4:4,0,1,0]	%Input[4:4,0,1,1]	%Input[4:4,0,1,2]	%Input[4:4,0,1,3]	%Input[4:4,0,2,0]	%Input[4:4,0,2,1]	%Input[4:4,0,2,2]	%Input[4:4,0,2,3]	%Input[4:4,1,0,0]	%Input[4:4,1,0,1]	%Input[4:4,1,0,2]	%Input[4:4,1,0,3]	%Input[4:4,1,1,0]	%Input[4:4,1,1,1]	%Input[4:4,1,1,2]	%Input[4:4,1,1,3]	%Input[4:4,1,2,0]	%Input[4:4,1,2,1]	%Input[4:4,1,2,2]	%Input[4:4,1,2,3]	%Input[4:5,0,0,0]	%Input[4:5,0,0,1]	%Input[4:5,0,0,2]	%Input[4:5,0,0,3]	%Input[4:5,0,1,0]	%Input[4:5,0,1,1]	%Input[4:5,0,1,2]	%Input[4:5,0,1,3]	%Input[4:5,0,2,0]	%Input[4:5,0,2,1]	%Input[4:5,0,2,2]	%Input[4:5,0,2,3]	%Input[4:5,1,0,0]	%Input[4:5,1,0,1]	%Input[4:5,1,0,2]	%Input[4:5,1,0,3]	%Input[4:5,1,1,0]	%Input[4:5,1,1,1]	%Input[4:5,1,1,2]	%Input[4:5,1,1,3]	%Input[4:5,1,2,0]	%Input[4:5,1,2,1]	%Input[4:5,1,2,2]	%Input[4:5,1,2,3]	%ECout[4:0,0,0,0]<4:6,2,3,4>	%ECout[4:0,0,0,1]	%ECout[4:0,0,0,2]	%ECout[4:0,0,0,3]	%ECout[4:0,0,1,0]	%ECout[4:0,0,1,1]	%ECout[4:0,0,1,2]	%ECout[4:0,0,1,3]	%ECout[4:0,0,2,0]	%ECout[4:0,0,2,1]	%ECout[4:0,0,2,2]	%ECout[4:0,0,2,3]	%ECout[4:0,1,0,0]	%ECout[4:0,1,0,1]	%ECout[4:0,1,0,2]	%ECout[4:0,1,0,3]	%ECout[4:0,1,1,0]	%ECout[4:0,1,1,1]	%ECout[4:0,1,1,2]	%ECout[4:0,1,1,3]	%ECout[4:0,1,2,0]	%ECout[4:0,1,2,1]	%ECout[4:0,1,2,2]	%ECout[4:0,1,2,3]	%ECout[4:1,0,0,0]	%ECout[4:1,0,0,1]	%ECout[4:1,0,0,2]	%ECout[4:1,0,0,3]	%ECout[4:1,0,1,0]	%ECout[4:1,0,1,1]	%ECout[4:1,0,1,2]	%ECout[4:1,0,1,3]	%ECout[4:1,0,2,0]	%ECout[4:1,0,2,1]	%ECout[4:1,0,2,2]	%ECout[4:1,0,2,3]	%ECout[4:1,1,0,0]	%ECout[4:1,1,0,1]	%ECout[4:1,1,0,2]	%ECout[4:1,1,0,3]	%ECout[4:1,1,1,0]	%ECout[4:1,1,1,1]	%ECout[4:1,1,1,2]	%ECout[4:1,1,1,3]	%ECout[4:1,1,2,0]	%ECout[4:1,1,2,1]	%ECout[4:1,1,2,2]	%ECout[4:1,1,2,3]	%ECout[4:2,0,0,0]	%ECout[4:2,0,0,1]	%ECout[4:2,0,0,2]	%ECout[4:2,0,0,3]	%ECout[4:2,0,1,0]	%ECout[4:2,0,1,1]	%ECout[4:2,0,1,2]	%ECout[4:2,0,1,3]	%ECout[4:2,0,2,0]	%ECout[4:2,0,2,1]	%ECout[4:2,0,2,2]	%ECout[4:2,0,2,3]	%ECout[4:2,1,0,0]	%ECout[4:2,1,0,1]	%ECout[4:2,1,0,2]	%ECout[4:2,1,0,3]	%ECout[4:2,1,1,0]	%ECout[4:2,1,1,1]	%ECout[4:2,1,1,2]	%ECout[4:2,1,1,3]	%ECout[4:2,1,2,0]	%ECout[4:2,1,2,1]	%ECout[4:2,1,2,2]	%ECout[4:2,1,2,3]	%ECout[4:3,0,0,0]	%ECout[4:3,0,0,1]	%ECout[4:3,0,0,2]	%ECout[4:3,0,0,3]	%ECout[4:3,0,1,0]	%ECout[4:3,0,1,1]	%ECout[4:3,0,1,2]	%ECout[4:3,0,1,3]	%ECout[4:3,0,2,0]	%ECout[4:3,0,2,1]	%ECout[4:3,0,2,2]	%ECout[4:3,0,2,3]	%ECout[4:3,1,0,0]	%ECout[4:3,1,0,1]	%ECout[4:3,1,0,2]	%ECout[4:3,1,0,3]	%ECout[4:3,1,1,0]	%ECout[4:3,1,1,1]	%ECout[4:3,1,1,2]	%ECout[4:3,1,1,3]	%ECout[4:3,1,2,0]	%ECout[4:3,1,2,1]	%ECout[4:3,1,2,2]	%ECout[4:3,1,2,3]	%ECout[4:4,0,0,0]	%ECout[4:4,0,0,1]	%ECout[4:4,0,0,2]	%ECout[4:4,0,0,3]	%ECout[4:4,0,1,0]	%ECout[4:4,0,1,1]	%ECout[4:4,0,1,2]	%ECout[4:4,0,1,3]	%ECout[4:4,0,2,0]	%ECout[4:4,0,2,1]	%ECout[4:4,0,2,2]	%ECout[4:4,0,2,3]	%ECout[4:4,1,0,0]	%ECout[4:4,1,0,1]	%ECout[4:4,1,0,2]	%ECout[4:4,1,0,3]	%ECout[4:4,1,1,0]	%ECout[4:4,1,1,1]	%ECout[4:4,1,1,2]	%ECout[4:4,1,1,3]	%ECout[4:4,1,2,0]	%ECout[4:4,1,2,1]	%ECout[4:4,1,2,2]	%ECout[4:4,1,2,3]	%ECout[4:5,0,0,0]	%ECout[4:5,0,0,1]	%ECout[4:5,0,0,2]	%ECout[4:5,0,0,3]	%ECout[4:5,0,1,0]	%ECout[4:5,0,1,1]	%ECout[4:5,0,1,2]	%ECout[4:5,0,1,3]	%ECout[4:5,0,2,0]	%ECout[4:5,0,2,1]	%ECout[4:5,0,2,2]	%ECout[4:5,0,2,3]	%ECout[4:5,1,0,0]	%ECout[4:5,1,0,1]	%ECout[4:5,1,0,2]	%ECout[4:5,1,0,3]	%ECout[4:5,1,1,0]	%ECout[4:5,1,1,1]	%ECout[4:5,1,1,2]	%ECout[4:5,1,1,3]	%ECout[4:5,1,2,0]	%ECout[4:5,1,2,1]	%ECout[4:5,1,2,2]	%ECout[4:5,1,2,3]"
    // chart number
    for (let h = 0; h < 2; h++) {
      // input vs ecout
      text = text + "\n_D:\tAB_" + h
      for (let i = 0; i < 2; i++) {
        // super rows
        for (let j = 5; j >= 0; j--) {
          // super columns
          for (let k = 0; k < 2; k++) {
            // rows
            for (let l = 2; l >= 0; l--) {
              // columns
              for (let m = 0; m < 4; m++) {
                let coordString = [h, i, j, k, l, m].join('')
                if (dict[coordString]) {
                  console.log("true")
                  text = text + "\t1"
                } else {
                  console.log("false")
                  text = text + "\t0"
                }
              }
            }
          }
        }
      }
    }

    let a = CSV.parse(text);
    console.log(a[0][0]);
    console.log(a[1][5]);

    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/tab-separated-values' });
    element.href = URL.createObjectURL(file);
    element.download = "test_ab_ps.tsv";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    // console.log(text)
  };

  render() {
    return (
      <div className="App">
        <div className="text-lg">
          TSV configuration
        </div>


        {/* <div className="flex justify-center px-4"> */}
        {/* <div className="max-w-5xl "> */}
        <div className="flex justify-center -mx-4">
          <div className="w-1/2">
            <p>Input</p>
            <div className="flex">
              <LRGroup chart={0} column={0} />

            </div>
          </div>
          <div className="w-1/2">
            <p>
              EC Out
              </p>
            <div className="flex">
              <LRGroup chart={0} column={1} />
            </div>

          </div>


        </div>

        <br /> <br />

        <div className="flex justify-center -mx-4">
          <div className="w-1/2">
            <p>Input</p>
            <div className="flex">
              <LRGroup chart={1} column={0} />

            </div>
          </div>
          <div className="w-1/2">
            <p>
              EC Out
              </p>
            <div className="flex">
              <LRGroup chart={1} column={1} />
            </div>

          </div>


        </div>


        {/* </div> */}
        {/* </div> */}


        <button onClick={this.download} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
          <span>Download</span>
        </button>

        {/* <div className="max-w-sm rounded overflow-hidden shadow-lg">
  
  
        </div> */}
      </div>
    );
  }

}

export default App;
