/* */
require('dotenv').config();
const mongo = require('mongodb');
const lib = require('./lib.js');
const connection = process.env.DB_STATS;

function testDB () {
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    console.log('Connected to database ... OK');
    db.close();
  });
}

function updateStats (req, res, next) {
  let service = res.locals.service;
  if (!service) {
    const original = req.originalUrl.split('/')[1];
    switch (original) {
      case 'sp500':
        service = 'sp500';
        break;
      case 'tetris':
        service = 'tetris';
        break;
    }
  }
  let dbData = {
    'ip': lib.getIP(req),
    'service': service,
    'time': new Date().toISOString().split('T')[0]
  };
  if (dbData.service) {
    try {
      if (process.env.NODE_ENV === 'production') {
        saveDataToDB(dbData);
      } else {
        console.log('SAVE TEST ...', dbData);
      }
    } catch (e) {
      const time = new Date().toUTCString().split(',')[1];
      console.log('########## STATS ERROR ##########');
      console.log(time);
      console.log(dbData);
      console.log(e);
      console.log('#################################');
    }
  } else {
    console.log('Not Service from ', dbData.ip);
  }
  next();
}

function saveDataToDB (dbData) {
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const database = db.db(process.env.DB_NAME);
    const collection = database.collection(process.env.COLLECTION);
    collection.insert(dbData, function (err, result) {
      if (err) throw err;
      db.close();
    });
  });
}

module.exports = {
  updateStats: updateStats,
  testDB: testDB
};
