/* */

console.log('Loading...mapGen.js');

import { C } from "./_config.js";
import * as render from "./render.js";
import * as voronoi from "./voronoi.js";

function init() {
  console.log('## Init ##', C.MODE);
  document.getElementById(C.ACTION).addEventListener("click", letsgo);
  //render.draw();

  if (C.MODE === "dev") {   // auto click in dev
    //letsgo();
  }
}

function letsgo() {
  const t0 = performance.now();
  voronoi.create();
  render.draw();
  const t1 = performance.now();
  const score = ((t1 - t0) / 1000).toFixed(2) + ' secs';
  document.getElementById("time").innerHTML = score;
}

window.addEventListener('load', init);

