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


from fastapi import FastAPI, File, UploadFile, Form
from fastapi.encoders import jsonable_encoder

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = torch.hub.load('ultralytics/yolov5', 'yolov5s')


@app.post("/objectdetection/")
async def objectdetection(image: UploadFile = File(None)):
    try:
        # print("CHECK: ", image)
        # obj = ObjectDetection(image)

        if image == None:
            return jsonable_encoder({
                "code": 201,
                "error_code": 1,
                "msg": "Missing Input Image"
            })

        contents = await asyncio.wait_for(image.read(), timeout=1)

        if (str(contents) == "b''"):
            return jsonable_encoder({
                "code": 201,
                "error_code": 2,
                "msg": "Not found file"
            })

        # # check image
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return jsonable_encoder({
                "code": 201,
                "error_code": 3,
                "msg": "Input is not an image"
            })

        # predict model
        results = model(img)
        results_json = json.loads(
            results.pandas().xyxy[0].to_json(orient="records"))

        # n = len(results_json)
        # if n>1:
        # for i in range(n):
        #     results_json[i]['xmin'] = int(results_json[i]['xmin'])
        #     results_json[i]['ymin'] = int(results_json[i]['ymin'])
        #     results_json[i]['xmax'] = int(results_json[i]['xmax'])
        #     results_json[i]['ymax'] = int(results_json[i]['ymax'])

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
