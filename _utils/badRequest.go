/* */

package _utils

import "net/http"

func BadRequest(w http.ResponseWriter, r *http.Request) {
	http.Error(w, "Bad request", http.StatusBadRequest)
}
