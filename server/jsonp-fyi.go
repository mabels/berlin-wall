package main

import (
	"fmt"
	"html"
	"strings"
	"bytes"
	"log"
	"io/ioutil"
	"net/http"
	"net/url"
	"crypto/tls"
)

func main() {
	tr := &http.Transport {
		TLSClientConfig:    &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		split := strings.Split(r.URL.Path, "/")
		schema := split[1]
		path := strings.Join(split[2:len(split)], "/")
		backendUrl := fmt.Sprintf("%s://%s", schema, path)
		log.Print(backendUrl)
		resp, err := client.Get(backendUrl)
		w.Header().Add("content-type", "application/javascript")
		if err == nil {
			content, _ := ioutil.ReadAll(resp.Body)
			str := html.EscapeString(bytes.NewBuffer(content).String())	
			q, _ := url.ParseQuery(r.URL.RawQuery)
			fmt.Fprintf(w, "%s(%q)", q["callback"][0], str)
	        }

	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}

