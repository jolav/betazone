package video2gif

var video2gifjson = []byte(`
{
	"app": {
		"version": "0.1.1",
		"mode": "production"
	},
	"video2gif": {
		"order": "1",
		"orderInt": 1
	} 
} 
`)

var c configuration

type configuration struct {
	App struct {
		Mode    string //`json:"mode"`
		Version string //`json:"version"`
	} //`json:"app"`
	Video2Gif struct {
		order    string
		orderInt int
	}
}

var e myError

type myError struct {
	Error string `json:"Error,omitempty"`
}

// VIDEO2GIF

type parameters2 struct {
	fps   int
	start int
	dur   int
	scale string
}

type parameters struct {
	fps   string
	start string
	dur   string
	scale string
}
