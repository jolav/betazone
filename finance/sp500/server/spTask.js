/* */

const lib = require(__dirname + '/lib.js');
const sp500ListFile = __dirname + '/sp500ListFile.json';
const templateFile = __dirname + '/template.json';
const getInfo1 = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=';
const getInfo2 = '&types=company,quote';
let getLast = 'https://api.iextrading.com/1.0/tops/last?symbols=';

/* https://en.wikipedia.org/wiki/List_of_S%26P_500_companies#Recent_changes_to_the_list_of_S&P_500_Components */

let returnData = [];

let template = [];
let symbolList = [];

function initApp () {
  getSymbolList();
// createTemplate()
}

function getSymbolList () {
  lib.loadJSONfile(sp500ListFile, function (dataSP500List) {
    // console.log('SYMBOL LIST => ', dataSP500List.length)
    for (let i = 0; i < dataSP500List.length; i++) {
      symbolList.push(dataSP500List[i].sym);
      let aux = {};
      aux.symbol = dataSP500List[i].sym;
      aux.companyName = '';
      aux.industry = '';
      aux.sector = '';
      aux.price = 0;
      aux.last = 0;
      template.push(aux);
    }
    if (process.env.NODE_ENV === 'production') {
      createTemplate();
    } else {
      lib.loadJSONfile(templateFile, function (data) {
        template = data;
        // console.log('SYMBOL LIST => ', dataSP500List.length)
        // console.log('TEMPLATE => ', template[0])
        initUpdateIntervals();
      });
    }
  });
}

function createTemplate () {
  // create requests
  let links = [];
  for (let i = 0; i < symbolList.length; i = i + 100) {
    let list = '';
    for (let index = i; index < i + 100; index++) {
      if (symbolList[index]) list += ',' + symbolList[index];
    }
    links.push(getInfo1 + list.substring(1) + getInfo2);
  }
  // do requests
  let requests = links.length;
  let stocks = [];
  for (let i = 0; i < links.length; i++) {
    lib.makeHttpsRequest(links[i], function (err, res, data) {
      requests--;
      for (let i in data) {
        stocks.push(data[i]);
      }
      if (requests === 0) { // populate template
        // console.log('STOCKS', stocks.length)
        let cont = 0;
        for (let i in stocks) {
          for (let t in template) {
            if (stocks[i].company.symbol === template[t].symbol) {
              template[t].companyName = stocks[i].company.companyName || '',
              template[t].industry = stocks[i].company.industry || '',
              template[t].sector = stocks[i].company.sector || '',
              template[t].price = stocks[i].quote.latestPrice || 0,
              template[t].last = stocks[i].quote.close || 0;
              cont++;
            }

            if (cont === stocks.length) {
              lib.writeJSONtoFile(templateFile, template, function () {
                initUpdateIntervals();
              });
            }
          }
        }
      }
    });
  }
}

function initUpdateIntervals () {
  // console.log('initUpdateIntervals')
  setInterval(function () {
    // console.log(getDataURL + symbolList)
    lib.makeHttpsRequest(getLast + symbolList, updateData);
  }, 5000);
}

function updateData (err, res, lastData) {
  if (err) {
    console.log(err);
    return;
  }
  for (let i = 0; i < lastData.length; i++) {
    if (lastData[i] !== null && lastData[i] !== undefined) {
      for (let t = 0; t < template.length; t++) {
        if (template[i].symbol === lastData[t].symbol) {
          template[i].price = lastData[t].price;
        }
      }
    }
  }
  returnData = template.sort(lib.dynamicSort('symbol'));
}

function getData (req, res, cb) {
  cb(returnData);
  return;
}

function onceADayTask () {
  const now = new Date();
  const target = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // the next day, ...
    5, 0, 0 // ...at 05:00:00 hours server local time
  );
  const msToTask = target.getTime() - now.getTime();

  setTimeout(function () {
    getSymbolList();
    onceADayTask();
  }, msToTask);
}

module.exports = {
  getData: getData,
  initApp: initApp
};
