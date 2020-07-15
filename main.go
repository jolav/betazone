/*
go build -ldflags="-X 'main.when=$(date -u +%F_%T)'"
*/

package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	u "betazone/_utils"
	s "betazone/sp500"
	t "betazone/tetris"
)

var version = "0.4.2"
var when = "undefined"

const (
	JSON_CONFIG_FILE = "./betazone.json"
)

type Conf struct {
	Mode          string
	Port          int
	ErrorsLogFile string
	HitsLogFile   string
}

func main() {
	checkFlags()

	var c Conf
	u.LoadJSONFile(JSON_CONFIG_FILE, &c)
	//u.PrettyPrintStruct(c)

	///// Custom Log File /////
	if c.Mode == "production" {
		var f = c.ErrorsLogFile
		mylog, err := os.OpenFile(f, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
		if err != nil {
			log.Fatalf("ERROR opening log file %s\n", err)
		}
		defer mylog.Close()
		log.SetOutput(mylog)
	}
	//////////////////////

	tetris := t.NewTetris()
	sp500 := s.NewSP500()

	mux := http.NewServeMux()

	mux.HandleFunc("/tetris/", tetris.Router)
	mux.HandleFunc("/sp500/", sp500.Router)
	mux.HandleFunc("/", u.BadRequest)

	server := http.Server{
		Addr:           fmt.Sprintf("localhost:%d", c.Port),
		Handler:        mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   30 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Printf("Server up listening %s in mode %s", server.Addr, c.Mode)
	server.ListenAndServe()
}

func checkFlags() {
	versionFlag := flag.Bool("v", false, "Show current version and exit")
	flag.Parse()
	switch {
	case *versionFlag:
		fmt.Printf("Version:\t: %s\n", version)
		fmt.Printf("Date   :\t: %s\n", when)
		os.Exit(0)
	}
}
