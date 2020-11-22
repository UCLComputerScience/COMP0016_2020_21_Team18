# Grace Chatbot

## Abstract
Chatbot created to help NHS staff get information about their patients, using graph database as its backend

## How to run
Run ` make up` to create a docker container with the project, go to `http://localhost:5000` to see the webserver running

## How to make changes
Edit `app.py` file to make changes/add additional routes. To make sure code is maintained using style practises, PyLint is used. To link it with Github commit procedure, please run `make lint-connect`.