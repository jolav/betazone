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
  const useGrid = document.getElementsByName("useGrid")[0].checked;
  switch (useGrid) {
    case true:
      createGridPoints(cells);
      break;
    case false:
      createRandomPoints(cells);
  }
}

function createGridPoints(cells) {
  const ratio = C.WIDTH / C.HEIGHT;
  const rows = Math.round(Math.sqrt(cells / ratio));
  const cols = Math.round(ratio * rows);
  const GRID_X = Math.floor(C.WIDTH / cols);
  const GRID_Y = Math.floor(C.HEIGHT / rows);
  points = [];
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      points.push(
        {
          x: ((x + C.DEVIATION * (Math.random() - Math.random())) * GRID_X) + (GRID_X / 2),
          y: ((y + C.DEVIATION * (Math.random() - Math.random())) * GRID_Y)
            + (GRID_Y / 2),
          c: util.randomColor()
        },
      );
    }
  }
  //console.log("POINTS =>", points.length, points);
}

function createRandomPoints(cells) {
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
  //console.log("POINTS =>", points.length, points);
}

export {
  create,
  points
};
