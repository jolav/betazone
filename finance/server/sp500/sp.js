/* */
const express = require('express');
const app = express();

const stock = require(__dirname + '/spTask.js');
const lib = require(__dirname + '/../../../_lib/lib.js');

stock.initApp();

app.get('/tick', function (req, res) {
  stock.getData(req, res, function (data) {
    lib.sendResult(req, res, data, 200);
  });
});

app.get('/*', function (req, res) {
  res.redirect('https://handytabs.com/notFound');
// res.status(404).send('Not Found, cough cough')
});

module.exports = app;
