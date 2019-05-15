package tetris

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	lib "../_lib"
)

func init() {
	//fmt.Println(`Init Tetris`)
	lib.LoadConfig(tetrisconfig, &c)
}

// Router ...
func Router(w http.ResponseWriter, r *http.Request) {
	e = myError{}
	params := strings.Split(strings.ToLower(r.URL.Path), "/")
	path := params[1:len(params)]
	if path[len(path)-1] == "" { // remove last empty slot after /
		path = path[:len(path)-1]
	}
	//fmt.Printf("Going ....%s %s %d\n", path, r.Method, len(path))
	if len(path) != 2 {
		badRequest(w, r, "Inexistent Endpoint")
		return
	}

	option := strings.ToLower(strings.Split(r.URL.Path, "/")[2])
	switch option {
	case "hs":
		if r.Method == "POST" {
			postHighScore(w, r)
			return
		}
		if r.Method == "GET" {
			getHighScore(w, r)
			return
		}
		badRequest(w, r, "Inexistent Endpoint")

	default:
		badRequest(w, r, "Inexistent Endpoint")
	}
}

func getHighScore(w http.ResponseWriter, r *http.Request) {
	lib.LoadJSONfromFileMarshall(c.Tetris.HighScoreFile, &hs)
	lib.SendJSONToClient(w, hs)
}

func postHighScore(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&hs)
	if err != nil {
		log.Printf(err.Error())
	}
	lib.WriteJSONtoFile(c.Tetris.HighScoreFile, hs)
}

func badRequest(w http.ResponseWriter, r *http.Request, msg string) {
	e := myError{}
	e.Error = fmt.Sprintf("%s...%s", msg, r.URL.RequestURI())
	if c.Tetris.Mode != "test" {
		log.Printf("ERROR = %s", e.Error)
	}
	lib.SendErrorToClient(w, e)
}
