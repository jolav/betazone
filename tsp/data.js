/* */

console.log('Loading.....data.js');

const d = {
  cities: 0,
  paths: 0,
  start: 0,
  nodes: [],
  graph: undefined,
  borders: {
    minX: 100,
    maxX: 100,
    minY: 100,
    maxY: 100,
  },
  ratio: 0,
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
      checkMinMax({ x, y });
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
  d.ratio = parseFloat((d.borders.maxX / d.borders.maxY)).toFixed(2);

}

function checkMinMax(pos) {
  if (pos.x > d.borders.maxX) {
    d.borders.maxX = pos.x;
  }
  if (pos.x < d.borders.minX) {
    d.borders.minX = pos.x;
  }
  if (pos.y > d.borders.maxY) {
    d.borders.maxY = pos.y;
  } if (pos.y < d.borders.minY) {
    d.borders.minY = pos.y;
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
