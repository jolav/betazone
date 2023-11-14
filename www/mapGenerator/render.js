/* */

import * as aux from './aux.js';

const cv = document.getElementById('canvas');
const ctx = cv.getContext('2d');
//const ppp = 1; // fails48 on FF but ok in chrome
cv.width = Math.floor((window.innerWidth - 120) / 10) * 10;
cv.height = Math.floor((window.innerHeight - 25) / 10) * 10;

function draw() {
  //console.log("draw");
  clearAll();
}

function fillCanvas() {
  ctx.fillStyle = aux.randomColor();
  ctx.fillRect(0, 0, cv.width, cv.height);
}

function clearAll() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.beginPath();
}

export {
  fillCanvas,
  draw
};

