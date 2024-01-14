/* */

console.log('Loading.....data.js');

const d = {
  cities: 0,
  paths: 0,
  start: 0,
  nodes: [],
  graph: undefined,
};

function parseRawData(rawData) {
  rawData = rawData.split("\r\n");
  let index = 1;
  for (let line of rawData) {
    if (index === 1) {
      d.cities = parseInt(line);
      d.graph = initializeMultiArray(d.cities, d.cities, 0);
    }
    if (index === 2) {
      d.paths = parseInt(line);
    }
    if (index === 3) {
      d.start = parseInt(line);
    }
    if (index > 3 && index <= d.cities + 3) {
      const x = parseInt(line.split(" ")[0]);
      const y = parseInt(line.split(" ")[1]);
      d.nodes[index - 3] = { x: x, y: y };
    }
    if (index > d.cities + 3 && index <= 3073) {
      const a = parseInt(line.split(" ")[0]);
      const b = parseInt(line.split(" ")[1]);
      const weight = parseInt(line.split(" ")[2]);
      d.graph[a][b] = weight;
      d.graph[b][a] = weight;
    }
    index++;
  }
}

function initializeMultiArray(cols, rows, value) {
  let array = [];
  for (let i = 1; i <= cols; i++) {
    array[i] = [];
    for (let j = 1; j <= rows; j++) {
      array[i][j] = value;
    }
  }
  return array;
}

export {
  parseRawData,
  d,
};
