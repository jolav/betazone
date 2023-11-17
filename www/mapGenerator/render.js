/* */

console.log('Loading...render.js');

import { C } from "./_config.js";
import * as util from './utils.js';
import { points } from "./voronoi.js";

const canvas = document.getElementById(C.CANVAS_NAME);
const ctx = canvas.getContext('2d');
const ppp = 5; // fails48 on FF but ok in chrome
let cols = 0;
let rows = 0;

function draw() {
  const select = document.getElementsByName("metricType")[0];
  const metric = select.options[select.selectedIndex].value;
  const calculateDistance = metricType(metric);
  updateDataDraw();
  clearAll();
  drawZones(calculateDistance);
  drawPoints();
}

function drawPoints() {
  ctx.fillStyle = "hsl(50%, 50%, 50%)";
  for (let { x, y } of points) {
    //ctx.fillRect(x, y, 1, 1); // For performance just rectangle of one
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function updateDataDraw() {
  cols = Math.floor(C.WIDTH / ppp);
  rows = Math.floor(C.HEIGHT / ppp);
  canvas.width = cols * ppp;
  canvas.height = rows * ppp;
}

function drawZones(calculateDistance) {
  const aux = canvas.width * canvas.height;
  for (let px = 0; px <= canvas.width; px++) {
    for (let py = 0; py <= canvas.height; py++) {
      let dm = aux;
      let minPX = 0;
      let minPY = 0;
      let color = "white";
      for (let { x, y, c } of points) {
        const deltaX = x - px;
        const deltaY = y - py;
        let d = calculateDistance(deltaX, deltaY);
        if (d < dm) {
          minPX = px;
          minPY = py;
          color = c;
          dm = d;
        }
      }
      ctx.fillStyle = color;
      ctx.fillRect(minPX, minPY, 1, 1);
    }
  }
}

// Calculate for all points the nearest neighbor and see what is the 
// greatest distance of those points.
function distanceThatGuaranteesThatYouHaveNeighbor(calculateDistance) {
  let distances = [];
  for (let i = 0; i < points.length; i++) {
    let shorter = C.WIDTH + C.HEIGHT;
    const query = points[i];
    for (let p = 1; p < points.length; p++) {
      const next = points[p];
      let d = calculateDistance(query.x - next.x, query.y - next.y);
      if (d < shorter && d !== 0) {
        shorter = d;
      }
    }
    distances.push(shorter);
  }
  return Math.max(...distances);

}

function metricType(metric) {
  switch (metric) {
    case "euclidean":
      return euclidean;
    case "manhattan":
      return manhattan;
    case "minkowski":
      return minkowski;
  }
}

function euclidean(deltaX, deltaY) {
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function manhattan(deltaX, deltaY) {
  return Math.abs(deltaX) + Math.abs(deltaY);
}

function minkowski(deltaX, deltaY) {
  const n = 3;
  return (1 / n) *
    (Math.pow(Math.abs(deltaX), n) +
      Math.pow(Math.abs(deltaY), n)
    );
}
function fillCanvas() {
  ctx.fillStyle = util.randomColor();
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function clearAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
}

export {
  //fillCanvas,
  draw,
};

