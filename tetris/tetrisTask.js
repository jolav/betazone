/* */

const filePath = __dirname + '/tetris.json';
const fs = require('fs');

const init = [
  {
    'player': 'cpu',
    'score': 9999
  },
  {
    'player': 'cpu',
    'score': 8888
  },
  {
    'player': 'cpu',
    'score': 7777
  },
  {
    'player': 'cpu',
    'score': 6666
  },
  {
    'player': 'cpu',
    'score': 5555
  }
];

function getHighScore (req, res) {
  loadJSONfile(filePath, function (data) {
    res.status(200).send(data);
  });
}

function postHighScore (req, res) {
  let score = req.body;
  for (let i in score) {
    if (score[i].player.length > 2) {
      score[i].player = score[i].player.slice(0, 3);
    }
  }
  writeJSONtoFile(filePath, score, function () {
    res.end();
  });
  res.end();
}

function loadJSONfile (filePath, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      callback(JSON.parse(data));
    }
  });
}

function writeJSONtoFile (filePath, dataSet, callback) {
  const json = JSON.stringify(dataSet);
  fs.writeFile(filePath, json, 'utf8', callback);
}

module.exports = {
  getHighScore: getHighScore,
  postHighScore: postHighScore
};
