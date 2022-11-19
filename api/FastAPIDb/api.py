from typing import Union

from fastapi import FastAPI
from fastapi import File, FastAPI

import uvicorn
import numpy as np

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


@app.get("/getResult/")
async def objectdetection():
    try:
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()

        # execute a statement
        cur.execute('SELECT * FROM "jobs"')
        allData = cur.fetchall()

        # # convert tuple to list
        # allData = [list(data) for data in allData]
        # print(allData)
        allData = [{
            'id': data[0],
            'uid': data[1],
            'job_name': data[2],
            'job_type': data[3],
            'url_api': data[4],
            'db_name': data[5]
            # list_map[i]: list(v)[i]
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
            INSERT INTO "jobs" (uid, job_type, url_api, db_name, start_time) 
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
    uvicorn.run("api:app", host="0.0.0.0", port=8001, reload=True)
