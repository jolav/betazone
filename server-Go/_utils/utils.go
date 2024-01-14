/* */

package _utils

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

func PrettyPrintStruct(s interface{}) {
	result, _ := json.MarshalIndent(s, "", "    ") //"\t")
	fmt.Print(string(result), "\n")
}

// MakeGetRequest ...
func MakeGetRequest(w http.ResponseWriter, url string, d interface{}) {
	var netClient = &http.Client{
		Timeout: time.Second * 10,
	}
	resp, err := netClient.Get(url)
	if err != nil {
		log.Fatal(err)
	}

	if resp.StatusCode != 200 {
		log.Fatal(err)
		return
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	// body is a string, for use we must Unmarshal over a struct
	err = json.Unmarshal(body, &d)
	if err != nil {
		log.Fatalln(err)
	}
}

// SliceContainsString ... returns true/false
func SliceContainsString(str string, slice []string) bool {
	for _, v := range slice {
		if v == str {
			return true
		}
	}
	return false
}
