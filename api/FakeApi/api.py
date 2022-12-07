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


@app.post("/classification")
async def predict(url_image=Form()):
    try:
        # print("CHECK: ", image)
        # obj = ObjectDetection(image)
        if url_image is None:
            return jsonable_encoder({
                "status": "fail",
                "data": "url_image is none"
            })

        response = requests.get(url_image)
        img_bytes = io.BytesIO(response.content)
        img = PIL.Image.open(img_bytes)
        # nparr = np.frombuffer(img_bytes, np.uint8)
        # img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        # predict model
        model = torch.hub.load('ultralytics/yolov5', 'yolov5s')
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
