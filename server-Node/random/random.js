/* */

import express from "express";
const random = express.Router();

import { randomInt } from "../aux.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const surnames = require("./surnames.json");

random.get("/name", function (req, res) {
  const nick = surnames[randomInt(0, surnames.length - 1)];
  //console.log('NICK = ', nick);
  res
    .status(200)
    .json({ name: nick });
});

export { random };  
