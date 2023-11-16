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

export {
  create,
  points
};
