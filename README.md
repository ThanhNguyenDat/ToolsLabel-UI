# ToolsLabelUI

## Work dir

    .
    ├── api
    │   ├── FakeApi
    │   ├── UploadFile
    │   ├── HistoryAPI
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
    │   │   ├── hooks
    │   │   ├── layouts
    │   │   ├── pages
    │   │   ├── resources
    │   │   ├── routers
    │   │   ├── services
    │   │   ├── utils
    │   │   ├── App.js
    │   │   ├── App.test.js
    │   │   ├── index.js
    │   │   ├── reportWebVitals.js
    │   │   └── setupTests.js
    │   ├── package-lock.json
    │   └── package.json
    ├── database
    │   ├── Benchmark.sql
    │   ├── dump_db.sh
    │   ├── restore_db.sh
    │   └── ZATools.dump
    ├── process
    │   ├── config
    │   │   ├── constants.py
    │   │   ├── database.ini
    │   │   └── database.py
    │   ├── ControlDatabase
    │   │   ├── __init__.py
    │   │   ├── ControlDatabase.py
    │   │   └── utils.py
    │   ├── logs
    │   ├── matrix
    │   │   └── classification.py
    │   ├── main.py
    │   ├── requirements.txt
    │   ├── start_process_classification.sh
    │   ├── utils.py
    │   └── yolov5s.pt
    └── README.md

# Dependence

```
ubuntu: "20.04" or above
postgres: "~> 12.x"
python: "~> 3.6" or above, file: "requirements.txt"
node: "~> 16.x", file: !["package.json"](https://raw.githubusercontent.com/ThanhNguyenDat/ToolsLabel-UI/main/client/package.json)
```

# Setup

## 1. Initialization Database

You need to edit database/restore_db.sh and run:

```
$ cd database && bash restore_db.sh
```

## 2. Initialization environment

```
$ cd client && npm install
```

# Start API and UI

## Run API

API for handle event Benchmark React

```
$ cd api/HistoryAPI && bash start_api.sh
```

## Run UI React

```
$ cd client && npm run start
```

## Run process

API for classification:

```
$ cd api/FakeApi && bash start_api.sh
```

Run process:

```
cd process && bash start_process_classification.sh
```

## Plan

- compare 2 api
- firebase <-> React
- adding api/crawl_data: image from keyword and mp3 from url
