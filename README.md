# ToolsLabelUI

## Work dir

    .
    ├── api
    │   ├── FastAPIDn
    │   │   ├── api.py
    │   │   ├── config.py
    │   │   ├── database.ini
    │   │   ├── requirements.txt
    │   │   └── start_api.sh
    │   └── object_detection
    │       ├── api.py
    │       ├── requirements.txt
    │       └── start_api.sh
    ├── client
    │   ├── node_modules
    │   ├── public
    │   │   ├── favicon.ico
    │   │   ├── index.html
    │   │   ├── manifest.json
    │   │   └── robots.txt
    │   ├── src
    │   │   ├── components
    │   │   ├── config
    │   │   │   ├── db
    │   │   │   │   └── postgresql_connection.js
    │   │   │   ├── firebase
    │   │   │   │   ├── firebase_connection.js
    │   │   │   │   └── upload_img.js
    │   │   ├── images
    │   │   ├── test
    │   │   ├── utils
    │   │   ├── App.css
    │   │   ├── App.js
    │   │   ├── App.test.js
    │   │   ├── index.css
    │   │   ├── index.js
    │   │   ├── logo.svg
    │   │   ├── reportWebVitals.js
    │   │   └── setupTests.js
    │   ├── package-lock.json
    │   └── package.json
    └── README.md

## Initial environment

`npm install`
`cd client && npm install`

## Run API

`cd api/JobsDBFastAPI && bash start_api.sh`
`cd api/JobClassificationDBFastAPI && bash start_api.sh`

## Run UI React

`npm run start-reactjs`

## Plan

- firebase <-> React
- adding api/crawl_data: image from keyword and mp3 from url
