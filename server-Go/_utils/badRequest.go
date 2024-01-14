/* */

package _utils

import (
	"encoding/json"
	"log"
	"net/http"
)

func BadRequest(w http.ResponseWriter, r *http.Request) {
	http.Error(w, "Bad request", http.StatusBadRequest)
}

// SendErrorToClient ...
func SendErrorToClient(w http.ResponseWriter, d interface{}) {
	w.WriteHeader(http.StatusBadRequest)
	w.Header().Set("Content-Type", "application/json")
	var dataJSON = []byte(`{}`)
	dataJSON, err := json.MarshalIndent(d, "", " ")
	if err != nil {
		log.Printf("ERROR Marshaling %s\n", err)
		w.Write([]byte(`{}`))
	}
	w.Write(dataJSON)
}
