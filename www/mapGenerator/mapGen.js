/* */

//import * as lib from "./aux.js";
import { fillCanvas, draw } from "./render.js";

const params = {
  canvas: "canvas",
  action: "doit"
};

function init() {
  console.log('## Init ##');
  console.log(window.innerWidth, window.innerHeight);
  fillCanvas();
  document.getElementById(params.action).addEventListener("click", create);

}

window.addEventListener('load', init);

function create() {
  let cells = document.getElementById("cells").value;
  if (cells === undefined || cells === "") {
    cells = document.getElementById("cells").defaultValue;
  }
  const select = document.getElementsByName("metricType")[0];
  const metric = select.options[select.selectedIndex].value;
  console.log(cells, metric);
  draw();
}

