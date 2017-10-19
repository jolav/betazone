const express = require('express');
const app = express();

const port = process.env.PORT || 3507;
const job = require('./doTheJob.js');

app.disable('x-powered-by');

global.bb = {}; // .spData ; 

app.get('/v1/tick/', (req, res) => {
  res.status(200).json(global.bb.spData);
});

app.use('/', (req, res) => {
  res.status(404).send('NOT FOUND');
});

app.listen(
  port,
  () => {
    console.log('Express server listening on port ' + port);
  },
  job.initApp()
);

module.exports = app;

/*
nodemon --ignore '*.json' app.js 
*/
