/* */

package _utils

import (
	"encoding/json"
	"fmt"
)

func PrettyPrintStruct(s interface{}) {
	result, _ := json.MarshalIndent(s, "", "    ") //"\t")
	fmt.Print(string(result), "\n")
}
