package sp500

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	lib "../_lib"
)

func init() {
	lib.LoadConfig(sp500config, &c)
	stocks = make(map[string]*stock)
	var ss []stock
	lib.LoadJSONfromFileMarshall(c.SP500.SymbolListFile, &ss)
	for k := range ss {
		stocks[ss[k].Symbol] = &stock{}
		symbolList = append(symbolList, ss[k].Symbol)

	}
	if c.SP500.Mode == "production" {
		linkList := createLinkList()
		populateDefaultStocks(linkList)
		populateStocks()
		lib.WriteJSONtoFile(c.SP500.SymbolDataFile, &stocks)
	} else {
		lib.LoadJSONfromFileMarshall(c.SP500.SymbolDataFile, &stocks)
	}
	initUpdateIntervals()
}

func initUpdateIntervals() {
	var u updates
	var w http.ResponseWriter
	url := c.SP500.UpdateValues + strings.Join(symbolList, ",")
	//fmt.Println(url)
	ticker := time.NewTicker(time.Millisecond * 1000)
	go func() {
		for _ = range ticker.C {
			u = updates{}
			lib.MakeGetRequest(w, url, &u)
			for _, v := range u {
				if v.Symbol != "" {
					stocks[v.Symbol].PriceNow = v.Price
				}
			}
			//t := time.Now()
			//hour, min, sec := t.Clock()
			//fmt.Println(`TICK`, hour, min, sec)
			/*if hour == 6 && min == 1 {
				if sec > 0 && sec < 6 {
					//go dailyWork()
				}
			}*/
		}
	}()
}

func populateStocks() {
	for k, _ := range stocks {
		elem, ok := stocksDefault[k]
		if ok {
			stocks[k].Symbol = elem.Company.Symbol
			stocks[k].CompanyName = elem.Company.CompanyName
			stocks[k].Industry = elem.Company.Industry
			stocks[k].Close = elem.Quote.Close
			stocks[k].PriceNow = elem.Quote.LatestPrice
			stocks[k].Sector = elem.Company.Sector
		}
	}
}

func populateDefaultStocks(links []string) {
	ch := make(chan []byte)
	for _, link := range links {
		go doGetConcurrentRequest(link, ch)
	}
	for range links {
		json.Unmarshal(<-ch, &stocksDefault)
	}
}

func doGetConcurrentRequest(url string, ch chan<- []byte) {
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

func createLinkList() []string {
	linkList := []string{}
	link := c.SP500.GetInfo1
	for k, v := range symbolList {
		if k%90 == 0 && k/90 > 0 {
			link = link[0 : len(link)-1] // remove last ,
			link += c.SP500.GetInfo2
			linkList = append(linkList, link) //[0:len(link)-1])
			link = c.SP500.GetInfo1 + v + ","
		} else {
			if k == len(symbolList)-1 { // last symbol
				link += v + c.SP500.GetInfo2
				linkList = append(linkList, link)
			} else {
				link += v + ","
			}
		}
	}
	return linkList
}
