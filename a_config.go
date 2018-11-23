package main

var configjson = []byte(`
{
  "app": {
    "mode": "production",
    "port": 3550,
		"hitslog":"./hits.log",
		"errlog":"./error.log"
	} 
}
`)

var c configuration
var e myError

type configuration struct {
	App struct {
		Mode    string //`json:"mode"`
		Port    int    //`json:"port"`
		HitsLog string
		ErrLog  string
	} //`json:"app"`
}

type myError struct {
	Error string `json:"Error,omitempty"`
}
