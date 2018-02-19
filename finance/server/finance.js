/* */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require('dotenv').config({ path: __dirname + '/../../_lib/.env' });
const stats = require(__dirname + '/../../_lib/stats.js');
const lib = require(__dirname + '/../../_lib/lib.js');

let port = 3000;
if (process.env.NODE_ENV === 'production') {
  port = process.env.PORT_FINANCE;
}

const sp = require('./sp500/sp.js');
const currency = require('./currency/currency.js');

app.disable('x-powered-by');

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

// app.use(stats.updateStats)

app.use('/sp500', sp);
app.use('/currency', currency);

app.get('*', function (req, res) {
  // res.redirect('https://handytabs.com/notFound')
  res.status(404).send('Not Found');
});

app.listen(port, function () {
  const time = new Date().toUTCString().split(',')[1];
  console.log('Express server on port ' + port + ' - ' + time);
  stats.testDB();
});

module.exports = app;
