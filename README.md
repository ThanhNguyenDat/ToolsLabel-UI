# ToolsLabelUI


## Work dir

    .
    ├── api
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
    ├── rasabot
    │   ├── images
    │   ├── venv
    │   ├── ZABot
    │   ├── README.md
    │   └── start_bot.sh
    └── README.md 


## Initial environment
`npm install`
`cd client && npm install`
`cd server && npm install`

## Run server Fastapi
`npm run start-api-object-detection`

## Run server React
`npm run start-reactjs`

## Run chatbot rasa api
`npm run start-rasabot-api`

## Plan
- firebase <-> React
- server nodejs configing
- adding api/crawl_data: image from keyword and mp3 from url