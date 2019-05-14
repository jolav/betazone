/* */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const stock = require(path.join(__dirname, 'spTask.js'));
const lib = require(path.join(__dirname, 'lib.js'));

stock.initApp();

app.disable('x-powered-by');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.get('/tick/', function (req, res) {
  stock.getData(req, res, function (data) {
    lib.sendResult(req, res, data, 200);
  });
});

app.get('/*', function (req, res) {
  res.redirect('https://jolav.me/notFound');
  // res.status(404).send('Not Found, cough cough')
});

module.exports = app;
