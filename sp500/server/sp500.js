require('dotenv').config();

const express = require('express');
const app = express();
const stock = require(__dirname + '/stock.js');
const lib = require(__dirname + '/lib.js');
const port = process.env.PORT || 3501;

app.disable('x-powered-by');

app.get('/v1/tick', function (req, res) {
  stock.getData(req, res, function (data) {
    lib.sendResult(req, res, data, 200);
  });
});

app.get('/*', function (req, res) {
  res.redirect('https://datasilo.org/notFound');
// res.status(404).send('Not Found, cough cough')
});

app.listen(
  port,
  () => {
    console.log('Express server listening on port ' + port);
  },
  initApp()
);

function initApp () {
  console.log('Init Server App');
  stock.initApp();
}

module.exports = app;
