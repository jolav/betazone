package main

// GOOS=linux GOARCH=amd64 go build

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	lib "./_lib"

	sp500 "./sp500"
	tetris "./tetris"
	video2gif "./video2gif"
)

func init() {
	lib.LoadConfig(configjson, &c)
	if c.App.Mode != "production" {
		c.App.Port = 3000
	}
}

func main() {
	////////////// SEND LOGS TO FILE //////////////////
	if c.App.Mode == "production" {
		var f = c.App.ErrLog
		mylog, err := os.OpenFile(f, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
		if err != nil {
			log.Printf("ERROR opening log file %s\n", err)
		}
		defer mylog.Close() // defer must be in main
		log.SetOutput(mylog)
	}
	///////////////////////////////////////////////////

	http.DefaultClient.Timeout = 10 * time.Second
	mux := http.NewServeMux()
	mux.HandleFunc("/tetris/", tetris.Router)
	mux.HandleFunc("/sp500/", sp500.Router)
	mux.HandleFunc("/video2gif/", video2gif.Router)
	mux.HandleFunc("/", badRequest)

	server := http.Server{
		Addr:           fmt.Sprintf("localhost:%d", c.App.Port),
		Handler:        mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   30 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	log.Printf("Server listening ...%s", server.Addr)
	server.ListenAndServe()
}

func badRequest(w http.ResponseWriter, r *http.Request) {
	e.Error = fmt.Sprintf("Inexistent Endpoint...%s", r.URL.RequestURI())
	if c.App.Mode != "test" {
		log.Printf("ERROR = %s", e.Error)
	}
	lib.SendErrorToClient(w, e)
}
