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
  voronoi.create();
  render.draw();
}

window.addEventListener('load', init);

