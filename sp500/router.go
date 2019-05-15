package sp500

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	lib "../_lib"
)

// Router ...
func Router(w http.ResponseWriter, r *http.Request) {
	//fmt.Println(`CONFIG => `, c)
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
	//fmt.Println(`OPTION => `, option)
	switch option {
	case "tick":
		if r.Method == "GET" {
			lib.SendJSONToClient(w, getData())
			return
		}
		badRequest(w, r, "Inexistent Endpoint")

	default:
		badRequest(w, r, "Inexistent Endpoint")
	}
}

func getData() map[string]*stock {
	return stocks
}

func badRequest(w http.ResponseWriter, r *http.Request, msg string) {
	e := myError{}
	e.Error = fmt.Sprintf("%s...%s", msg, r.URL.RequestURI())
	if c.SP500.Mode != "test" {
		log.Printf("ERROR = %s", e.Error)
	}
	lib.SendErrorToClient(w, e)
}
