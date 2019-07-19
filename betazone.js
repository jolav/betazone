/* */

const express = require('express');
const app = express();

const path = require('path');

const c = require(path.join(__dirname, '_config.js'));

const sp500 = require(path.join(__dirname, './sp500/sp.js'));
const tetris = require(path.join(__dirname, './tetris/tetris.js'));

if (c.app.mode === 'dev') {
  c.app.port = 3000;
}

app.disable('x-powered-by');

app.use(function (req, res, next) {
  // CORS better in nginx
  //res.header('Access-Control-Allow-Origin', '*');//req.headers.origin);
  //res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/sp500', sp500);
app.use('/tetris', tetris);

app.get('/*', function (req, res) {
  res.status(404).json("404 Not found");
});

app.listen(c.app.port, function () {
  const time = new Date().toUTCString().split(',')[1];
  console.error('Express server on port ' + c.app.port + ' - ' + time);
});

module.exports = app; 
