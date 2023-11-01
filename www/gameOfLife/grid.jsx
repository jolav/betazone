/* global ReactDOM React */

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.gridStatus = this.gridStatus.bind(this);
    this.clickCell = this.clickCell.bind(this);
  }
  gridStatus() {
    const cellSize = {
      padding: "5px"
    };
    let grid = [];
    let line = [];
    for (let x = 0; x < this.props.status.ct.cols; x++) {
      let aux = [];
      for (let y = 0; y < this.props.status.ct.rows; y++) {
        aux.push(
          <div key={x + ":" + y} id={x + ":" + y} style={cellSize}
            className={"unit " + 'c' + this.props.status.grid[x][y]}
            onClick={this.clickCell}>
          </div>
        );
      }
      line = (<div key={(x * 10)}>{aux}</div>);
      grid.push(line);
    }
    return (
      <div className="board">
        {grid}
      </div>
    );
  }
  clickCell(e) {
    this.props.clickCell(e);
  }
  render() {
    return (
      <div>
        {this.gridStatus()}
      </div>);
  }
}


