from typing import Union

from fastapi import FastAPI
import io
import json
from PIL import Image
from fastapi import File, FastAPI
import torch
import asyncio
import urllib3
import uvicorn
import base64
import cv2
import numpy as np
import requests
import PIL

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.encoders import jsonable_encoder

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import config
import psycopg2

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/getDataset")
async def getData():
    try:
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()
        _sub = ["id", "dataset_name", "dataset_type"]
        __sub = ""
        for s in _sub:
            __sub = __sub + ", " + s
        __sub = __sub[2:]
        # execute a statement
        sql = f"""SELECT {__sub} FROM "Dataset" """
        cur.execute(sql)
        allData = cur.fetchall()

        # # convert tuple to list
        # allData = [list(data) for data in allData]
        # print(allData)

        allData = [{
            _sub[i]: data[i] for i in range(len(_sub))
        } for data in allData]

        # print(allData)

        return jsonable_encoder({
            'status': 'success',
            'data': allData
        })

    except Exception as e:
        print(e)


@app.post("/classification/")
async def classification(url: Union[str, None] = None):
    try:
        # print("CHECK: ", image)
        # obj = ObjectDetection(image)
        model = torch.hub.load('ultralytics/yolov5', 'yolov5s')
        if url is None:
            return jsonable_encoder({
                "status": "fail",
                "data": "url is none"
            })

        response = requests.get(url)
        img_bytes = io.BytesIO(response.content)
        img = PIL.Image.open(img_bytes)
        # nparr = np.frombuffer(img_bytes, np.uint8)
        # img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        # predict model
        results = model(img)
        results_json = json.loads(
            results.pandas().xyxy[0].to_json(orient="records"))

        # get classification
        results_json = results_json[0]['class']

        return jsonable_encoder({
            "status": "success",
            "data": results_json,
        })

    except Exception as e:
        print(e)
        return jsonable_encoder({
            "status": "fail",
            "data": str(e)
        })

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8003, reload=True)
