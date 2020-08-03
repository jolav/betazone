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
	"strings"
	"time"

	u "betazone/_utils"
	//s "betazone/sp500"
	t "betazone/tetris"
)

var version = "0.4.4"
var when = "undefined"

type Conf struct {
	Mode          string
	Port          int
	ErrorsLogFile string
	DevHosts      []string
}

func main() {
	checkFlags()

	var c Conf
	u.LoadJSONConfig(getGlobalConfigJSON(), &c)
	checkMode(&c)
	u.PrettyPrintStruct(c)

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
	//sp500 := s.NewSP500()

	mux := http.NewServeMux()

	mux.HandleFunc("/tetris/", tetris.Router)
	//mux.HandleFunc("/sp500/", sp500.Router)
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

func checkMode(c *Conf) {
	serverName, _ := os.Hostname()
	serverName = strings.ToLower(serverName)
	if u.SliceContainsString(serverName, c.DevHosts) {
		c.Mode = "dev"
		c.Port = 3000
	}
}

func FAKE__getGlobalConfigJSON() (configjson []byte) {
	// real getGlobalConfigJSON() in private.go file
	configjson = []byte(`
	{
		"mode": "production",
		"port": XXXXX,
		"errorsLogFile": "path/to/errors.log",
		"devHosts" : [
			"list",
			"of",
			"dev",
			"hosts"
		]
	}
	`)
	return
}
