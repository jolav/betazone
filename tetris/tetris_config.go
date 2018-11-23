package tetris

var tetrisconfig = []byte(`
{ 
	"tetris":	{
		"version": "0.2.4",
		"mode": "production",
		"hsJSONFile": "./tetris/tetris.json"
	}
}
`)

var c configuration
var e myError

var hs highScore

type highScore []struct {
	Player string `json:"player"`
	Score  int    `json:"score"`
}

type configuration struct {
	Tetris struct {
		HighScoreFile string `json:"hsJSONFile"`
		Mode          string
		Version       string
	}
}

type myError struct {
	Error string `json:"Error,omitempty"`
}

/*
curl
--header "Content-Type: application/json"
--request POST
--data '[{"player":"www","score":8},{"player":"RUS","score":5},{"player":"Obe","score":4},{"player":"USA","score":3},{"player":"alW","score":1}]'
http://localhost:3000/tetris/hs

*/
