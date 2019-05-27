/* */
const https = require('https');
const fs = require('fs');

function sendResult(req, res, data, status) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).send(JSON.stringify(data, null, 3));
}

function makeHttpsRequest(path, callback) {
  https.get(path, (res) => {
    res.setEncoding('utf8');
    var body = '';
    res.on('data', (d) => {
      body += d;
    });
    res.on('end', () => {
      try {
        var parsed = JSON.parse(body);
      } catch (err) {
        console.error('Unable to parse response as JSON', err);
        return callback(err, null, {});
      }
      // pass the relevant data back to the callback
      callback(null, res, parsed);
    });
  }).on('error', (err) => {
    // handle errors with the request itself
    console.error('Error with the request:', err.message);
    callback(err, null, {});
  });
}

function loadJSONfile(filePath, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      callback(JSON.parse(data));
    }
  });
}

function writeJSONtoFile(filePath, dataSet, callback) {
  const json = JSON.stringify(dataSet);
  fs.writeFile(filePath, json, 'utf8', callback);
}

function dynamicSort(property) {
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

function getIP(req) {
  return (req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress || req.socket.remoteAddress ||
    req.connection.socket.remoteAddress).split(',')[0];
}

module.exports = {
  makeHttpsRequest: makeHttpsRequest,
  loadJSONfile: loadJSONfile,
  writeJSONtoFile: writeJSONtoFile,
  dynamicSort: dynamicSort,
  sendResult: sendResult,
  getIP: getIP
};
