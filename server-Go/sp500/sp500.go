/* */

package sp500

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	u "betazone/_utils"
)

const IEXCLOUD_API_KEY_PUBLIC = "FAKE"

type sp500 struct {
	Conf struct {
		Dev            bool   `json:"dev"`
		RefreshTime    string `json:"refreshTime"`
		SymbolListFile string `json:"symbolListFile"`
		SymbolDataFile string `json:"symbolDataFile"`
		GetInfo1       string `json:"getInfo1"`
		GetInfo2       string `json:"getInfo2"`
		UpdateValues1  string `json:"updateValues1"`
		UpdateValues2  string `json:"updateValues2"`
		UpdateValues   string `json:"updateValues"`
	}
	Stocks        map[string]*stock
	SymbolList    []string
	Quotes        map[string]*aux
	StocksDefault map[string]*fillData
}

type stock struct {
	Symbol      string  `json:"symbol"`
	CompanyName string  `json:"companyName"`
	Industry    string  `json:"industry"`
	Sector      string  `json:"sector"`
	PriceNow    float64 `json:"price"`
	Close       float64 `json:"last"`
}

type fillData struct {
	Company struct {
		Symbol      string `json:"symbol"`
		CompanyName string `json:"companyName"`
		Industry    string `json:"industry"`
		Sector      string `json:"sector"`
	} `json:"company"`
}

type updates []struct {
	Symbol string  `json:"symbol"`
	Price  float64 `json:"price"`
}

type aux struct {
	Quote struct {
		Symbol      string  `json:"symbol"`
		Close       float64 `json:"previousClose"`
		LatestPrice float64 `json:"latestPrice"`
	} `json:"quote"`
}

func NewSP500() sp500 {
	sp := sp500{ // *new(sp500)
		Stocks: make(map[string]*stock),
	}
	u.LoadJSONConfig(sp500config, &sp.Conf)
	var ss []stock
	u.LoadJSONFile(sp.Conf.SymbolListFile, &ss)
	for k := range ss {
		sp.Stocks[ss[k].Symbol] = new(stock) //&stock{}
		sp.SymbolList = append(sp.SymbolList, ss[k].Symbol)
	}
	if sp.Conf.Dev {
		fmt.Println("dev")
		u.LoadJSONFile(sp.Conf.SymbolDataFile, &sp.Stocks)
		sp.getLastDayValues()
	} else {
		fmt.Println("production")
		linkList := sp.createLinkList()
		sp.populateDefaultStocks(linkList)
		sp.populateStocks()
		sp.getLastDayValues()
		u.WriteJSONtoFile(sp.Conf.SymbolDataFile, &sp.Stocks)
	}
	sp.initUpdateIntervals()
	return sp
}

func (sp *sp500) getLastDayValues() {
	var w http.ResponseWriter
	linkList := []string{}
	link := sp.Conf.UpdateValues1
	////
	for k, v := range sp.SymbolList {
		if k%90 == 0 && k/90 > 0 {
			link = link[0 : len(link)-1]
			link += sp.Conf.UpdateValues2
			linkList = append(linkList, link)
			link = sp.Conf.UpdateValues1 + v + ","
		} else {
			if k == len(sp.SymbolList)-1 {
				link += v + sp.Conf.UpdateValues2
				linkList = append(linkList, link)
			} else {
				link += v + ","
			}
		}
	}
	for _, link := range linkList {
		u.MakeGetRequest(w, link, &sp.Quotes)
		for _, v := range sp.SymbolList {
			elem, ok := sp.Quotes[v]
			if ok {
				if elem.Quote.Symbol == v {
					sp.Stocks[sp.Quotes[v].Quote.Symbol].Close = elem.Quote.Close
				}
			}
		}
	}
}

// Router ...
func (sp *sp500) Router(w http.ResponseWriter, r *http.Request) {
	option := strings.ToLower(strings.Split(r.URL.Path, "/")[2])
	switch option {
	case "tick":
		if r.Method == "GET" {
			u.SendJSONToClient(w, sp.getData())
			return
		}
	}
	u.BadRequest(w, r)
}

func (sp *sp500) initUpdateIntervals() {
	var up updates
	var w http.ResponseWriter
	url := sp.Conf.UpdateValues + strings.Join(sp.SymbolList, ",")
	ticker := time.NewTicker(time.Millisecond * 2000)
	go func() {
		for _ = range ticker.C {
			up = updates{}
			u.MakeGetRequest(w, url, &up)
			for _, v := range up {
				if v.Symbol != "" {
					sp.Stocks[v.Symbol].PriceNow = v.Price
				}
			}
		}
	}()
}

func (sp *sp500) getData() map[string]*stock {
	return sp.Stocks
}

func (sp *sp500) populateStocks() {
	for k, _ := range sp.Stocks {
		elem, ok := sp.StocksDefault[k]
		if ok {
			sp.Stocks[k].Symbol = elem.Company.Symbol
			sp.Stocks[k].CompanyName = elem.Company.CompanyName
			sp.Stocks[k].Industry = elem.Company.Industry
			sp.Stocks[k].Sector = elem.Company.Sector
		}
	}
}

func (sp *sp500) populateDefaultStocks(links []string) {
	ch := make(chan []byte)
	for _, link := range links {
		go sp.doGetConcurrentRequest(link, ch)
	}
	for range links {
		json.Unmarshal(<-ch, &sp.StocksDefault)
	}
}

func (sp *sp500) doGetConcurrentRequest(url string, ch chan<- []byte) {
	resp, err := http.Get(url)
	if err != nil {
		msg := fmt.Sprintf("ERROR 1 HTTP Request %s", err)
		log.Printf(msg)
		ch <- []byte(msg)
		return
	}
	if resp.StatusCode != 200 {
		msg := fmt.Sprintf("ERROR 2 HTTP Request Status Code %d", resp.StatusCode)
		log.Printf(msg)
		ch <- []byte(msg)
		return
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		msg := fmt.Sprintf("ERROR 3 HTTP Request %s", err)
		log.Printf(msg)
		ch <- []byte(msg)
		return
	}
	ch <- body
}

func (sp *sp500) createLinkList() []string {
	linkList := []string{}
	link := sp.Conf.GetInfo1
	for k, v := range sp.SymbolList {
		if k%90 == 0 && k/90 > 0 {
			link = link[0 : len(link)-1] // remove last ,
			link += sp.Conf.GetInfo2 + IEXCLOUD_API_KEY_PUBLIC
			linkList = append(linkList, link) //[0:len(link)-1])
			link = sp.Conf.GetInfo1 + v + ","
		} else {
			if k == len(sp.SymbolList)-1 { // last symbol
				link += v + sp.Conf.GetInfo2 + IEXCLOUD_API_KEY_PUBLIC
				linkList = append(linkList, link)
			} else {
				link += v + ","
			}
		}
	}
	return linkList
}
