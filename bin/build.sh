#!/bin/bash

# Take the contents of index.html and feed it into 
FILE="./dist/index.html"
file_content=$(<"$FILE")
cleaned_string=$(echo "$file_content" | tr -d '\t\n')

echo -e "\nCleaned Source:"
echo "$cleaned_string"

# copy the saltlick.json file
cp ./saltlick.json ./dist/saltlick.json
JSON_FILE="./dist/saltlick.json"
# add the source content
echo "$(jq --arg source_arg "$cleaned_string" '. += {"source": $source_arg}' ./dist/saltlick.json)" > ./dist/saltlick.json

# take the contents of saltlick.json and parse them
json_content=$(<"$JSON_FILE")

echo -e "\nModified JSON:"
echo "$json_content"

echo "window.storyFormat($json_content);" > ./public/format.js

echo "DONE"