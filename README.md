# ToolsLabelUI

# Table of Contents

<!--ts-->

- [Setup](#setup)
  - [Initialization Database](#1-initialization-database)
  - [Initialization environment](#2-initialization-environment)
- [Start API and UI](#start-api-and-ui)
  - [Run API](#1-run-api)
  - [Run UI React](#2-run-ui-react)
  - [Run Process](#3-run-process)
- [Dependency](#ii-dependency)

<!--te-->

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

## 1. Run API

API for handle event Benchmark React

```
$ cd api/HistoryAPI && bash start_api.sh
```

## 2. Run UI React

```
$ cd client && npm run start
```

## 3. Run process

API for classification:

```
$ cd api/FakeApi && bash start_api.sh
```

Run process:

```
cd process && bash start_process_classification.sh
```

# Dependency

```
ubuntu: "20.04" or above
postgres: "~> 12.x"
python: "~> 3.6" or above, file: "requirements.txt"
node: "~> 16.x", file: "client/package.json"
```

## Plan

- compare 2 api
- firebase <-> React
- adding api/crawl_data: image from keyword and mp3 from url
