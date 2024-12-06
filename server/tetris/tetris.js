/* */

import express from "express";
const tetris = express.Router();

import bodyParser from "body-parser";

import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = __dirname + '/highScore.json';

tetris.use(bodyParser.json()); // to support JSON-encoded bodies
tetris.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

tetris.use(express.json());

tetris.get("/hs", function (req, res) {
  loadJSONfile(filePath, function (highScore) {
    res
      .status(200)
      .send(highScore);
  });
});

tetris.post("/hs", function (req, res) {
  let score = req.body;
  console.log('==>', req.body);
  for (let i in score) {
    if (score[i].player.length > 2) {
      score[i].player = score[i].player.slice(0, 3);
    }
  }
  writeJSONtoFile(filePath, score, function () {
    res.end();
  });
  res.end();
});

export { tetris };

function loadJSONfile(filePath, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      callback(JSON.parse(data));
    }
  });
}

function writeJSONtoFile(filePath, dataSet, callback) {
  const dataJson = JSON.stringify(dataSet);
  console.log(dataJson);
  fs.writeFile(filePath, dataJson, 'utf8', callback);
}

/*
curl --header "Content-Type: application/json" --request POST --data '[
  {
    "player": "AAA",
    "score": 1000
  },
  {
    "player": "BBB",
    "score": 800
  },
  {
    "player": "CCC",
    "score": 600
  },
  {
    "player": "DDD",
    "score": 400
  },
  {
    "player": "EEE",
    "score": 200
  }
]
' http://localhost:3000/tetris/hs
*/
