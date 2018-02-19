/* */
const express = require('express');
const bodyParser = require('body-parser');

const job = require('./tetrisTask.js');

const app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies

app.get('/hs', function (req, res) {
  job.getHighScore(req, res);
});

app.post('/hs', function (req, res) {
  job.postHighScore(req, res);
});

app.use('*', function (req, res) {
  res.redirect('https://handytabs.com/notFound');
// res.status(404).send('Not Found')
});

module.exports = app;
