/* */

package sp500

var sp500config = []byte(`
{ 
		"dev": false,
		"refreshTime": 2000,
		"symbolListFile": "./sp500/data/symbolList.json",
		"symbolDataFile": "./sp500/data/symbolData.json",
		"getInfo1": "https://cloud.iexapis.com/stable/stock/market/batch?symbols=",
		"getInfo2": "&types=company&token=",
		"updateValues1": "https://cloud.iexapis.com/stable/stock/market/batch?symbols=",
		"updateValues2": "&types=quote&token=pk_df6dc41e56b34dbfb81f1465080cbec6",
		"updateValues":"https://api.iextrading.com/1.0/tops/last?symbols="
}
`)
