package tetris

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	u "betazone/_utils"
)

type tetris struct {
	HighScoreFile string `json:"hsJSONFile"`
	HighScore     []struct {
		Player string `json:"player"`
		Score  int    `json:"score"`
	}
}

// Router ...
func (t *tetris) Router(w http.ResponseWriter, r *http.Request) {
	option := strings.ToLower(strings.Split(r.URL.Path, "/")[2])
	switch option {
	case "hs":
		if r.Method == "POST" {
			t.postHighScore(w, r)
			return
		}
		if r.Method == "GET" {
			t.getHighScore(w, r)
			return
		}
	}
	u.BadRequest(w, r)
}

func (t *tetris) getHighScore(w http.ResponseWriter, r *http.Request) {
	//u.LoadJSONFile(t.HighScoreFile, &t.HighScore)
	u.SendJSONToClient(w, &t.HighScore)
}

func (t *tetris) postHighScore(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&t.HighScore)
	if err != nil {
		log.Printf("Error saving HighScore = %s", err.Error())
		return
	}
	u.WriteJSONtoFile(t.HighScoreFile, t.HighScore)
}

func NewTetris() tetris {
	t := tetris{ //*new(tetris)
		HighScoreFile: "./tetris/highScore.json",
		HighScore:     nil,
	}
	u.LoadJSONFile(t.HighScoreFile, &t.HighScore)
	return t
}

/*
curl --header "Content-Type: application/json" --request POST --data '[
  {
    "player": "AAA",
    "score": 1000
  },
  {
    "player": "BBB",
    "score": 800
  },
  {
    "player": "CCC",
    "score": 600
  },
  {
    "player": "DDD",
    "score": 400
  },
  {
    "player": "EEE",
    "score": 200
  }
]
' http://localhost:3550/tetris/hs
*/
