from typing import Union
import os
import uvicorn
import numpy as np

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi import requests

import psycopg2
from config import config

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


@app.get("/getResult")
async def classification(dataset_id: Union[int, None] = None):
    try:
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()
        _sub = ['dataset_id', 'url_image', 'label']
        __sub = ""

        for s in _sub:
            __sub = __sub + ", " + s
        __sub = __sub[2:]

        # execute a statement
        sql = f"""SELECT {__sub} FROM "DatasetItems" """
        if dataset_id:
            sql = f"""SELECT {__sub} FROM "DatasetItems" WHERE dataset_id = {dataset_id}"""
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


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8002, reload=True)
