/* global ReactDOM React */

const destination = document.getElementById('life');


const layout = (
  <div>
    <Game />
  </div>
);

ReactDOM.render(
  layout,
  destination
);

function getNewGrid(filler, cols, rows) {
  let res = [];
  let status = [];
  let lives = 0;
  let aux;
  for (let x = 0; x < cols; x++) {
    status[x] = [];
    for (let y = 0; y < rows; y++) {
      if (filler === 'random') {
        // aux = Math.floor(Math.random() * 2) // 50% 0 - 50% 1
        aux = Math.floor(Math.random() * 4);
        if (aux > 0) {
          aux = 0;
        } else if (aux === 0) {
          aux = 1;
          lives++;
        }
      } else if (filler === 'cls') {
        aux = 0;
      }
      status[x][y] = aux;
    }
  }
  res[0] = status;
  res[1] = lives;
  return res;
}

function initArray(cols, rows, value) {
  let array = [];
  for (let i = 0; i < cols; i++) {
    array[i] = [];
    for (let j = 0; j < rows; j++) {
      array[i][j] = value;
    }
  }
  return array;
}


