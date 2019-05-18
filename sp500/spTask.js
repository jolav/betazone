/* */

const path = require('path');

const c = require(path.join(__dirname, '../_config.js'));
const d = require(path.join(__dirname, '_config.js'));
const lib = require(path.join(__dirname, 'lib.js'));

let stocks = {};
let symbolList = [];
let returnData = {};
const updateInterval = 2000;

async function initApp() {
  try {
    let data = await getSymbolList();
    stocks = data[0];
    symbolList = data[1];
    if (c.app.mode === 'production') {
      createStocks();
    } else {
      stocks = await loadstocks();
    }
  } catch (error) {
    console.log('FAIL', error);
  }
  onceADayTask();
  initUpdateIntervals();
}

function loadstocks() {
  return new Promise((resolve, reject) => {
    lib.loadJSONfile(d.sp.templateFile, function (data) {
      let result = {};
      for (let key in data) {
        result[key] = data[key];
      }
      resolve(result);
    });
  });
}

function getSymbolList() {
  return new Promise((resolve, reject) => {
    lib.loadJSONfile(d.sp.sp500ListFile, function (sp500list) {
      //console.log('SYMBOL LIST => ', sp500list);
      for (let i = 0; i < sp500list.length; i++) {
        symbolList.push(sp500list[i].symbol);
        let stock = {};
        stock.symbol = sp500list[i].symbol;
        stock.companyName = '';
        stock.industry = '';
        stock.sector = '';
        stock.price = 0;
        stock.last = 0;
        //stocks.push(stock);
        stocks[stock.symbol] = stock;
      }
      resolve([stocks, symbolList]);
    });
  });
}

function createStocks() {
  // create requests
  let links = [];
  for (let i = 0; i < symbolList.length; i = i + 100) {
    let list = '';
    for (let index = i; index < i + 100; index++) {
      if (symbolList[index]) list += ',' + symbolList[index];
    }
    links.push(d.sp.getInfo1 + list.substring(1) + d.sp.getInfo2);
  }
  // do requests
  let requests = links.length;
  let newDatas = [];
  for (let i = 0; i < links.length; i++) {
    lib.makeHttpsRequest(links[i], function (err, res, data) {
      requests--;
      for (let i in data) {
        newDatas.push(data[i]);
      }
      if (requests === 0) { // populate stocks
        //console.log('newDatas', newDatas.length);
        let cont = 0;
        for (let i in newDatas) {
          for (let t in stocks) {
            if (newDatas[i].company.symbol === stocks[t].symbol) {
              stocks[t].companyName = newDatas[i].company.companyName || '';
              stocks[t].industry = newDatas[i].company.industry || '';
              stocks[t].sector = newDatas[i].company.sector || '';
              stocks[t].price = newDatas[i].quote.latestPrice || 0;
              stocks[t].last = newDatas[i].quote.close || 0;
              cont++;
            }

            if (cont === newDatas.length) {
              lib.writeJSONtoFile(d.sp.templateFile, stocks, function () {
                return;
              });
            }
          }
        }
      }
    });
  }
}

function initUpdateIntervals() {
  //console.log('initUpdateIntervals')
  setInterval(function () {
    //console.log('UPDATE TICK');
    //console.log(d.sp.getLast + symbolList);
    lib.makeHttpsRequest(d.sp.getLast + symbolList, updateData);
  }, updateInterval);
}

function updateData(err, res, lastData) {
  if (err) {
    console.log(err);
    return;
  }
  //console.log(lastData);
  for (let i = 0; i < lastData.length; i++) {
    if (lastData[i] !== null && lastData[i] !== undefined) {
      stocks[lastData[i].symbol].price = lastData[i].price;
    }
  }
  const sorted = Object.keys(stocks).sort();
  for (let i = 0; i < sorted.length; i++) {
    returnData[sorted[i]] = stocks[sorted[i]];
  }
}

function getData(req, res, cb) {
  cb(returnData);
  return;
}

function onceADayTask() {
  const now = new Date();
  const target = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // the next day, ...
    5, 0, 0 // ...at 05:00:00 hours server local time
  );
  const msToTask = target.getTime() - now.getTime();

  setTimeout(function () {
    //getSymbolList();
    createStocks();
    onceADayTask();
  }, msToTask);
}

module.exports = {
  getData: getData,
  initApp: initApp
};

