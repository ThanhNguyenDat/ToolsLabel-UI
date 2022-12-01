# ToolsLabelUI

## Work dir

    .
    ├── api
    │   ├── FakeApi
    │   ├── JobClassificationDBFastAPI
    │   ├── JobsDBFastAPI
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
    │   │   ├── asserts
    │   │   ├── components
    │   │   ├── config
    │   │   │   ├── db
    │   │   │   │   └── postgresql_connection.js
    │   │   │   ├── firebase
    │   │   │   │   ├── firebase_connection.js
    │   │   │   │   └── upload_img.js
    │   │   ├── hooks
    │   │   ├── layouts
    │   │   ├── pages
    │   │   ├── resources
    │   │   ├── routers
    │   │   ├── services
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
    ├── database
    │   ├── ZATools.dump
    │   └── restore_db.sh
    └── README.md

## Restore database postgres

You need to edit database/restore_db.sh and run:
`cd database && bash restore_db.sh`

## Initial environment

`cd client && npm install`

## Run API

`cd api/JobsDBFastAPI && bash start_api.sh`

`cd api/JobClassificationDBFastAPI && bash start_api.sh`

`cd api/FakeApi && bash start_api.sh`

## Run UI React

`cd client && npm run start`

## Plan

- firebase <-> React
- adding api/crawl_data: image from keyword and mp3 from url
