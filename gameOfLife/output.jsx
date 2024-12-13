/* global ReactDOM React */

class Output extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="down">
        <div className="down1">
          <div className="generation">
            <span className="tag">GENERATION :</span>
            <button id="score" className="cell">{this.props.out.gen}
            </button>
          </div>
          <div className="cells">
            <span className="tag">LIVE CELLS :</span>
            <button id="living" className="cell">{this.props.out.lives}
            </button>
          </div>
        </div>
        <div className="legend down2">
          <span className="">You can add or remove Cells during Pause</span>
        </div>
      </div>
    );
  }
}