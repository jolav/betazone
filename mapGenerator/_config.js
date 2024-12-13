/* */

let C = {
  // MapGen
  ACTION: "doit",
  MIN_CELLS: 1,
  MAX_CELLS: 500,
  DEFAULT_CELLS: 20,
  // Render
  CANVAS_NAME: "canvas",
  WIDTH: Math.floor((window.innerWidth - 120) / 10) * 10,
  HEIGHT: Math.floor((window.innerHeight - 25) / 10) * 10,
  // Voronoi
  DEVIATION: 0.7,
  // Status
  MODE: "online",
};

function updateA(data) {
  C = data;
}

(function autoUpdateC() {
  const where = window.location.hostname;
  if (where === "localhost" || where === "127.0.0.1") {
    C.MODE = "dev";
  }
})();

export {
  C,
  updateA,
}; 
