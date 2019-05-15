package sp500

var sp500config = []byte(`
{ 
	"sp500":	{
		"version": "0.1.11",
		"mode": "production",
		"symbolListFile": "./sp500/data/symbolList.json",
		"symbolDataFile": "./sp500/data/symbolData.json",
		"getInfo1": "https://api.iextrading.com/1.0/stock/market/batch?symbols=",
		"getInfo2": "&types=company,quote",
		"updateValues": "https://api.iextrading.com/1.0/tops/last?symbols="
	}
}
`)

var symbolList []string

var stocksDefault map[string]*stockDefaultFromAPI

var stocks map[string]*stock

type stock struct {
	Symbol      string  `json:"symbol"`
	CompanyName string  `json:"companyName"`
	Industry    string  `json:"industry"`
	Sector      string  `json:"sector"`
	PriceNow    float64 `json:"price"`
	Close       float64 `json:"last"`
}

type stockDefaultFromAPI struct {
	Company struct {
		Symbol      string `json:"symbol"`
		CompanyName string `json:"companyName"`
		Industry    string `json:"industry"`
		Sector      string `json:"sector"`
	} `json:"company"`
	Quote struct {
		Close       float64 `json:"close"`
		LatestPrice float64 `json:"latestPrice"`
	} `json:"quote"`
}

type updates []struct {
	Symbol string  `json:"symbol"`
	Price  float64 `json:"price"`
}

var c configuration
var e myError

type configuration struct {
	SP500 struct {
		Mode           string //`json:"mode"`
		Version        string
		SymbolListFile string
		SymbolDataFile string
		GetInfo1       string
		GetInfo2       string
		UpdateValues   string
	}
}

type myError struct {
	Error string `json:"Error,omitempty"`
}
