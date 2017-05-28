package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	lorem "github.com/drhodes/golorem"
)

const OutputDir = "./dist"

var OutputExts = []string{"js", "css", "ttf", "png"}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	addr := ":" + port
	http.HandleFunc("/", AppHandler)
	http.HandleFunc("/text", LoremHandler)
	log.Fatal(http.ListenAndServe(addr, nil))
}

func AppHandler(w http.ResponseWriter, r *http.Request) {
	var name string
	ext := filepath.Ext(r.URL.Path)
	if ext == "" && (r.URL.Path == "/" || r.URL.Path == "/hangman") {
		name = filepath.Join(OutputDir, "index.html")
	} else if ext == "" && r.URL.Path == "/test" {
		name = filepath.Join(OutputDir, "test.html")
	} else {
		for _, e := range OutputExts {
			if strings.HasSuffix(ext, e) {
				name = filepath.Join(OutputDir, r.URL.Path)
				break
			}
		}
		if name == "" {
			http.Error(w, "Not Found", 404)
			return
		}
	}
	log.Printf("GET %s: %s\n", r.URL.Path, name)
	http.ServeFile(w, r, name)
}

func LoremHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(lorem.Paragraph(5, 10)))
}
