/* */

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const job = require('./tetrisTask.js');
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.get('/hs', function (req, res) {
  console.log('GET HS');
  job.getHighScore(req, res);
});

app.post('/hs', function (req, res) {
  console.log('POST HS');
  job.postHighScore(req, res);
});

app.use('*', function (req, res) {
  res.redirect('https://jolav.me/notFound');
  // res.status(404).send('Not Found')
});

/*app.listen(port, function () {
  const time = new Date().toUTCString().split(',')[1];
  console.log('Express server on port ' + port + ' - ' + time);
});*/

module.exports = app;
