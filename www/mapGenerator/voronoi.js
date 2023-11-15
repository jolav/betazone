/* */

console.log('Loading...voronoi.js');

import * as util from "./utils.js";
import { C } from "./_config.js";

let points = [];

function create() {
  let cells = parseInt(document.getElementById("cells").value);
  if (cells < C.MIN_CELLS || cells > C.MAX_CELLS || isNaN(cells)) {
    cells = parseInt(document.getElementById("cells").defaultValue);
  }
  //const select = document.getElementsByName("metricType")[0];
  //const metric = select.options[select.selectedIndex].value;
  createPoints(cells);
}

function createPoints(cells) {
  points = [];
  for (let k = 0; k < cells; k++) {
    points.push(
      {
        x: util.randomInteger(0, C.WIDTH),
        y: util.randomInteger(0, C.HEIGHT),
        c: util.randomColor()
      },
    );
  }
  console.log("POINTS =>", points.length, points);
}

function createGRIDPoints() {
  points = [];
  let cols = Math.floor(C.WIDTH / C.GRIDSPACE_X);
  let rows = Math.floor(C.HEIGHT / C.GRIDSPACE_Y);
  console.log(cols, rows);
  for (let x = 0; x <= cols; x++) {
    for (let y = 0; y <= rows; y++) {
      points.push(
        {
          x: x + C.DEVIATION * (Math.random() - Math.random()),
          y: y + C.DEVIATION * (Math.random() - Math.random()),
        },
      );
    }
  }
}

export {
  create,
  points
};
