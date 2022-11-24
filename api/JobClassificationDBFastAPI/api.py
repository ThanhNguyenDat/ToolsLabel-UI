from typing import Union
import os
import uvicorn
import numpy as np

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi import requests
from werkzeug import security

import psycopg2
from sklearn.metrics import confusion_matrix

from config import config

TABLE_NAME = '"job_classification"'

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/getResult/")
async def classification(id_job: Union[int, None] = None):
    try:
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()
        _sub = ['id_job', 'url_image', 'class_label',
                'flag_predict_1', 'predict_1', 'conferences_1']
        __sub = ""
        for s in _sub:
            __sub = __sub + ", " + s
        __sub = __sub[2:]
        # execute a statement
        sql = f"""SELECT {__sub} FROM {TABLE_NAME}"""
        if id_job:
            sql = f"""SELECT {__sub} FROM {TABLE_NAME} WHERE id_job={id_job}"""
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
        return jsonable_encoder({
            'status': 'fail',
            'error': str(e)
        })

    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')


@app.post("/upload")
async def upload_file():
    file = requests.Request['file']


def gen_file_name(filename):
    """
    If file was exist already, rename it and return a new name
    """

    i = 1
    while os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
        name, extension = os.path.splitext(filename)
        filename = '%s_%s%s' % (name, str(i), extension)
        i += 1

    return filename


def compute_metric(class_label=[], predict_1=[], conferences: int = 0):
    return confusion_matrix(class_label, predict_1)


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8002, reload=True)
