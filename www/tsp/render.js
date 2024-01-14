/* */

console.log('Loading.....render.js');

import { d } from "./data.js";

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 25;
//console.log(canvas.width, canvas.height);
const ctx = canvas.getContext("2d");
const pixelSize = 4;
const scale = 1.5; //1.25;

function map() {
  draw.clearAll();
  draw.cities();
  draw.roads();
}

const draw = {
  clearAll: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  },
  cities: function () {
    ctx.fillStyle = "darkgreen";
    for (let city = 1; city < d.nodes.length; city++) {
      const x = this.rescale(d.nodes[city].x);
      const y = this.rescale(d.nodes[city].y);
      ctx.fillRect(x - pixelSize / 2, y - pixelSize / 2, pixelSize, pixelSize);
    }
  },
  roads: function () {
    ctx.fillStyle = "darkgreen";
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    for (let col = 1; col < d.cities; col++) {
      for (let row = 1; row < d.cities; row++) {
        if (d.graph[col][row] > 0 && col >= row) {
          ctx.moveTo(
            this.rescale(d.nodes[col].x),
            this.rescale(d.nodes[col].y)
          );
          ctx.lineTo(
            this.rescale(d.nodes[row].x),
            this.rescale(d.nodes[row].y)
          );
        }
      }
    }
    ctx.stroke();

  },
  rescale: function (n) {
    return Math.round(n / scale);
  }
};

export {
  map
};
