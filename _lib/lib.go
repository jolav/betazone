package lib

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"time"
)

// SendJSONToClient ...
func SendJSONToClient(w http.ResponseWriter, d interface{}) {
	w.Header().Set("Content-Type", "application/json")
	var dataJSON = []byte(`{}`)
	dataJSON, err := json.MarshalIndent(d, "", " ")
	if err != nil {
		log.Printf("ERROR Marshaling %s\n", err)
		w.Write([]byte(`{}`))
	}
	w.Write(dataJSON)
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

// WriteFile ...
func WriteFile(filePath string, content string) {
	file, err := os.Create(filePath)
	if err != nil {
		log.Printf("Error WriteFile %s\n", err)
	}
	defer file.Close()
	file.WriteString(content)
}

// LoadJSONfromFileMarshall ...
func LoadJSONfromFileMarshall(filePath string, data interface{}) {
	file, err := os.Open(filePath)
	if err != nil {
		log.Printf("Cannot open config file %s\n", err)
	}
	defer file.Close()
	body, err := ioutil.ReadAll(file) //	get file content
	if err != nil {
		log.Printf("Error 1 LoadJSONfromFileMarshall %s\n", err)
	}
	err = json.Unmarshal(body, &data)
	if err != nil {
		log.Printf("Error 2 LoadJSONfromFileMarshall %s\n", err)
	}
}

// WriteJSONtoFile ...
func WriteJSONtoFile(filePath string, d interface{}) {
	f, err := os.Create(filePath)
	if err != nil {
		panic(err)
	}
	defer f.Close()
	e := json.NewEncoder(f)
	e.Encode(&d)
}

// LoadConfig ...
func LoadConfig(configjson []byte, c interface{}) {
	err := json.Unmarshal(configjson, &c)
	if err != nil {
		log.Printf("ERROR LoadConfig %s\n", err)
	}
}

// GetIP ...
func GetIP(r *http.Request) string {
	ip := r.Header.Get("X-Forwarded-For")
	if len(ip) > 0 {
		return ip
	}
	ip, _, _ = net.SplitHostPort(r.RemoteAddr)
	return ip
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

// GenericCommand ...
func GenericCommand(args []string) (err error) {
	_, err = exec.Command(args[0], args[1:len(args)]...).CombinedOutput()
	if err != nil {
		//fmt.Println("ERROR CMD= ", err)
		return err
	}
	return err
}

// GenericCommandSH ...
func GenericCommandSH(comm string) (chunk []byte, err error) {
	chunk, err = exec.Command("sh", "-c", comm).CombinedOutput()
	if err != nil {
		return nil, err
	}
	return chunk, err
}
