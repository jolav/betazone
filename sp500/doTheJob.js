const lib = require('./lib.js');

const configFile = './config/config.json';
const listFile = './config/list.json';
const listSP500url = 'https://dimon.ca/my/snp500.json';
let getDataURL = 'https://api.iextrading.com/1.0/tops/last?symbols=';

let symbolList = '';
let stockData = [];
let howManyStocks = 0;
let development = false;

/* init
	lib.LoadJSONfromFileMarshall(configFile, &api)
	maintenance()
	initUpdateIntervals()
*/

exports.initApp = function () {
  onceADayTask();
  console.log('Init APP');
  lib.loadJSONfile(configFile, 1, maintenance);
};

/* maintenance
	getSymbolList()
	populateList()
	getLastDayPrice()
	lib.WriteJSONtoFile(listFile, stockData)
*/

function maintenance () {
  // console.log('Maintenance')
  lib.makeHttpRequest(listSP500url, getSymbolList);
}

function getSymbolList (err, data) {
  if (err) {
    return;
  }
  // console.log('getSymbolList')
  let symlist = [];
  for (let i = 0; i < data.members.length; i++) {
    symlist[i] = {};
    symlist[i].sym = data.members[i].sym;
    if (i !== data.members.length - 1) {
      symbolList += symlist[i].sym + ',';
    } else {
      symbolList += symlist[i].sym;
    }
  }
  // console.log(`We have ${symlist.length} companies`)
  if (development) {
    lib.loadJSONfile(listFile, 0, initUpdateIntervals);
    return;
  }
  howManyStocks = symlist.length;
  // get all companies data
  // console.log('getAllCompaniesData', howManyStocks)
  for (let i = 0; i < symlist.length; i++) {
    let sym = symlist[i].sym;
    let link = 'https://api.iextrading.com/1.0/stock/' + sym + '/company';
    // console.log(link)
    lib.makeHttpRequest(link, addElementToStockData);
  }
}

function addElementToStockData (err, elem) {
  // console.log(elem.symbol)
  let aux = {};
  if (err) {
    aux.symbol = '';
    aux.companyName = '';
    aux.industry = '';
    aux.sector = '';
    aux.price = 0;
    aux.last = 0;
  } else {
    aux.symbol = elem.symbol;
    aux.companyName = elem.companyName;
    aux.industry = elem.industry;
    aux.sector = elem.sector;
    aux.price = elem.price || 0;
    aux.last = elem.last || 0;
  }
  stockData.push(aux);
  if (stockData.length === howManyStocks) {
    // console.log('getLastDayPrice')
    getLastDayPrice();
  }
}

function getLastDayPrice () {
  for (let i = 0; i < stockData.length; i++) {
    let sym = stockData[i].symbol;
    let link = 'https://api.iextrading.com/1.0/stock/' + sym + '/quote';
    lib.makeHttpRequest(link, addLastPriceToList);
  }
}

function addLastPriceToList (err, elem) {
  if (err) {
    howManyStocks--;
  }
  for (let i = 0; i < stockData.length; i++) {
    if (stockData[i].symbol === elem.symbol) {
      stockData[i].last = elem.close;
      howManyStocks--;
    }
  }
  if (howManyStocks === 0) {
    // console.log('writeJSONtoFile')
    lib.writeJSONtoFile(listFile, stockData, initUpdateIntervals);
  }
}

function initUpdateIntervals () {
  if (development) {
    stockData = global.bb.spData;
  }
  // console.log('initUpdateIntervals')
  setInterval(function () {
    lib.makeHttpRequest(getDataURL + symbolList, updateData);
  }, 5000);
}

function updateData (err, data) {
  if (err) {
    // console.log(err)
    return;
  }
  for (let i = 0; i < stockData.length; i++) {
    for (let j = 0; j < stockData.length; j++) {
      if (data[j] !== null) {
        if (stockData[i].symbol === data[j].symbol) {
          stockData[i].price = data[j].price;
        }
      }
    }
  }
  global.bb.spData = stockData.sort(lib.dynamicSort('symbol'));
}

function onceADayTask () {
  let now = new Date();
  let target = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // the next day, ...
    5, 0, 0 // ...at 05:00:00 hours server local time
  );
  let msToTask = target.getTime() - now.getTime();

  setTimeout(function () {
    maintenance();
    onceADayTask();
  }, msToTask);
}
