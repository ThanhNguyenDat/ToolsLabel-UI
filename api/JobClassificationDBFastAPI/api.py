from typing import Union

from fastapi import FastAPI
from fastapi import File, FastAPI

import uvicorn
import numpy as np

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.encoders import jsonable_encoder
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2

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
async def objectdetection():
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
        cur.execute(sql)
        allData = cur.fetchall()

        # # convert tuple to list
        # allData = [list(data) for data in allData]
        # print(allData)

        allData = [{
            _sub[i]: data[i] for i in range(len(_sub))
        } for data in allData]

        print(allData)

        return jsonable_encoder(allData)

    except Exception as e:
        print(e)
        return jsonable_encoder({
            "ERROR": str(e)
        })

    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')


@app.post("/job_submit")
async def job_form_submit(uid: int = Form(), job_type: str = Form(), url_api: str = Form(), db_name: str = Form()):
    try:
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()

        record = (uid, job_type, url_api, db_name, 'now')
        # execute a statement
        cur.execute("""
            INSERT INTO "{TABLE}" (uid, job_type, url_api, db_name, start_time) 
            values (%s, %s, %s, %s, %s);
                    """, record)

        conn.commit()

        return "Successfully"

    except Exception as e:
        print(e)
        return jsonable_encoder({
            "ERROR": str(e)
        })

    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8002, reload=True)
