/* */

const app = {
  "sp500ListFile": __dirname + '/data/symbolList.json',
  "templateFile": __dirname + '/data/symbolData.json',
  "getInfo1": 'https://api.iextrading.com/1.0/stock/market/batch?symbols=',
  "getInfo2": '&types=company,quote',
  "getLast": 'https://api.iextrading.com/1.0/tops/last?symbols=',
  "wiki": 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies#Recent_changes_to_the_list_of_S&P_500_Components'
};

module.exports = {
  app: app
};

