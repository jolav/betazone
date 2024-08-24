/* */

import express from "express";
import helmet from 'helmet';

import { config } from "./_config.js";
import { logger } from "./middlewares.js";
import { random } from "./random/random.js";
import { tetris } from "./tetris/tetris.js";

const app = express();

app.use(helmet());
app.disable('x-powered-by');

app.use(logger);

// routes
app.use('/random', random);
app.use("/tetris", tetris);

app.get("/version", function (req, res) {
  res
    .status(200)
    .json({ version: config.version });
});

app.get("/ping", function (req, res) {
  res
    .status(200)
    .json({ ping: "ok" });
});

// custom 404
app.use(function (req, res) {
  console.error('Unavailable Endpoint', req.path);
  res.
    status(404)
    .json({ status: "Unavailable Endpoint " + req.path });
});

// custom error 
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.
    status(500).
    json({ status: "Internal Server Error" });
});

app.listen(config.port || 3000, function () {
  console.log('Server running on port ', config.port);
});
