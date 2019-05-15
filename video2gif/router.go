package video2gif

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	lib "../_lib"
)

// Router ...
func Router(w http.ResponseWriter, r *http.Request) {
	e = myError{}
	params := strings.Split(strings.ToLower(r.URL.Path), "/")
	path := params[1:len(params)]
	if path[len(path)-1] == "" { // remove last empty slot after /
		path = path[:len(path)-1]
	}
	//fmt.Printf("Going ....%s %s %d\n", path, r.Method, len(path))
	if len(path) != 1 {
		badRequest(w, r, "Inexistent Endpoint")
		return
	}
	option := strings.ToLower(strings.Split(r.URL.Path, "/")[1])
	//fmt.Println(`OPTION => `, option)
	switch option {

	case "video2gif":
		if r.Method == "POST" {
			c.Video2Gif.orderInt++
			c.Video2Gif.order = strconv.Itoa(c.Video2Gif.orderInt)
			doVideo2GifRequest(w, r, c.Video2Gif.order)
			return
		}

	default:
		badRequest(w, r, "Bad Format")
	}
}

func badRequest(w http.ResponseWriter, r *http.Request, msg string) {
	e := myError{}
	e.Error = fmt.Sprintf("%s...%s", msg, r.URL.RequestURI())
	if c.App.Mode != "test" {
		log.Printf("ERROR = %s", e.Error)
	}
	lib.SendErrorToClient(w, e)
}
