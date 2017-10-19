const https = require('https');
const fs = require('fs');

function makeHttpRequest (path, callback) {
  https.get(path, (res) => {
    // explicitly treat incoming data as utf8 
    res.setEncoding('utf8');
    // incrementally capture the incoming response body
    var body = '';
    res.on('data', (d) => {
      body += d;
    });
    // do whatever we want with the response once it's done
    res.on('end', () => {
      try {
        var parsed = JSON.parse(body);
      } catch (err) {
        console.error('Unable to parse response as JSON', err);
        return callback(err);
      }
      // pass the relevant data back to the callback
      callback(null, parsed);
    });
  }).on('error', (err) => {
    // handle errors with the request itself
    console.error('Error with the request:', err.message);
    callback(err);
  });
}

function loadJSONfile (filePath, flag, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (flag === 1) {
        global.bb.c = JSON.parse(data);
      }
      if (flag === 0) {
        console.log('OK');
        global.bb.spData = JSON.parse(data);
      }
      callback();
    }
  });
}

function writeJSONtoFile (filePath, dataSet, callback) {
  const json = JSON.stringify(dataSet);
  fs.writeFile(filePath, json, 'utf8', callback);
}

function dynamicSort (property) {
  var sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  };
}

module.exports = {
  makeHttpRequest: makeHttpRequest,
  loadJSONfile: loadJSONfile,
  writeJSONtoFile: writeJSONtoFile,
  dynamicSort: dynamicSort
};
