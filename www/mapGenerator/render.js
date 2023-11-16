/* */

console.log('Loading...render.js');

import { C } from "./_config.js";
import * as util from './utils.js';
import { points } from "./voronoi.js";

const canvas = document.getElementById(C.CANVAS_NAME);
const ctx = canvas.getContext('2d');
const ppp = 1; // fails48 on FF but ok in chrome
let cols = 0;
let rows = 0;

function draw() {
  updateDataDraw();
  clearAll();
  drawZones();
  drawPoints();
}

function drawPoints() {
  //console.log("DRAW POINTS =>", points.length, points);
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
  //console.log('width =', C.WIDTH, " | height =", C.HEIGHT,
  //  " | cols =", cols, " | rows =", rows);
}

function drawZones() {
  const select = document.getElementsByName("metricType")[0];
  const metric = select.options[select.selectedIndex].value;
  let calculateDistance = euclidean;
  if (metric === "manhattan") {
    calculateDistance = manhattan;
  }
  switch (metric) {
    case "euclidean":
      calculateDistance = euclidean;
      break;
    case "manhattan":
      calculateDistance = manhattan;
      break;
    case "minkowski":
      calculateDistance = minkowski;
      break;
  }
  for (let px = 0; px <= canvas.width; px++) {
    for (let py = 0; py <= canvas.height; py++) {
      let dm = canvas.width * canvas.height;
      for (let { x, y, c } of points) {
        const deltaX = x - px;
        const deltaY = y - py;
        let d = calculateDistance(deltaX, deltaY);
        if (d < dm) {
          ctx.fillStyle = c;
          ctx.fillRect(px, py, 1, 1);
          dm = d;
        }
      }
    }
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

