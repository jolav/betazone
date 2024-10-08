/* */

import express from "express";
import helmet from 'helmet';

import { config } from "./_config.js";
import { AppError } from "./middlewares.js";
import { mw } from "./middlewares.js";
import { random } from "./random/random.js";
import { tetris } from "./tetris/tetris.js";

const app = express();

app.use(helmet());
app.disable('x-powered-by');

app.use(mw.logger.bind(mw));

// routes
app.use('/random', random);
app.use("/tetris", tetris);

app.get("/version", function (req, res) {
  mw.sendResult(res, 200, { version: config.version }, false);
});

app.get("/ping", async function (req, res) {
  const start = Date.now();
  const min = parseInt(req.query.min) || 0;
  const max = parseInt(req.query.max) || 0;
  if (min >= max || min < 0 || min > 1000 || max < 1 || max > 1000) {
    //console.log(min, max);
    mw.sendResult(res, 400, { ping: "badrequest" }, false);
    return;
  }
  await help.sleep(min, max);

  const turn = Date.now() - start;
  mw.sendResult(res, 200, { ping: turn }, false);
});

app.use(function notFound(req, res, next) {
  next(new AppError(404, "Route Not Found"));
});

app.use(function errorHandler(err, req, res, next) {
  if (!err.isOperational) {
    console.error("Unexpected Error:", err.stack || err);
  }
  const status = err.status || 500;
  let message = "Internal Server Error";
  if (err.isOperational) {
    message = err.message;
  }
  mw.sendResult(res, status, { "msg": message }, false);
});

app.listen(config.port, function () {
  console.log(
    '\n*****************************************************\n',
    'process.env.pm.id => ', process.env.pm_id + "\n",
    'process.pid => ', process.pid + "\n",
    'Server', config.name.toUpperCase(),
    "version", config.version,
    "running on port", config.port, "\n" +
  '*****************************************************'
  );
});

const help = {
  sleep: function (min, max) {
    const delay = this.randomInt(min, max);
    return new Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
  },
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

};
