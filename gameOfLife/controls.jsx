/* global ReactDOM React */

class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.clickControl = this.clickControl.bind(this);
  }
  clickControl(e) {
    this.props.clickControl(e);
  }
  render() {
    const active = {
      backgroundColor: "burlywood",
    };
    return (
      <div className="up">
        <div className="up1">
          <div className="controls">
            <span className="tag">controls</span>
            <span onClick={this.clickControl} id="0" className="btn"
              style={this.props.ct.control === 1 ? active : undefined}>Run</span>
            <span onClick={this.clickControl} id="1" className="btn"
              style={this.props.ct.control === 2 ? active : undefined}>
              {this.props.ct.show}</span>
            <span onClick={this.clickControl} id="2" className="btn"
              style={this.props.ct.control === 3 ? active : undefined}>Clear</span>
          </div>
          <div className="speed">
            <span className="tag">speed</span>
            <span onClick={this.clickControl} id="3" className="btn"
              style={this.props.ct.speed === 1 ? active : undefined}>x0.5</span>
            <span onClick={this.clickControl} id="4" className="btn"
              style={this.props.ct.speed === 2 ? active : undefined}>x1</span>
            <span onClick={this.clickControl} id="5" className="btn"
              style={this.props.ct.speed === 3 ? active : undefined}>x3</span>
          </div>
        </div>
        <div className="size up2">
          <span className="tag">size</span>
          <span onClick={this.clickControl} id="6" className="btn"
            style={this.props.ct.size === 1 ? active : undefined}>20x20</span>
          <span onClick={this.clickControl} id="7" className="btn"
            style={this.props.ct.size === 2 ? active : undefined}>50x40</span>
          <span onClick={this.clickControl} id="8" className="btn"
            style={this.props.ct.size === 3 ? active : undefined}>80x50</span>
        </div>
      </div >);
  }
}

