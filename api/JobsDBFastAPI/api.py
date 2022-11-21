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

TABLE_NAME = '"jobs"'

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
async def getResult(id: Union[int, None] = None):
    try:
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()
        _sub = ['id', 'uid', 'job_name', 'job_type', 'url_api', 'db_name',
                'total', 'rest', 'skiped', 'stat', 'start_time', 'end_time',
                'accuracy', 'precision', 'recall', 'f1_score', 'auc_roc', 'log_loss',
                'tp', 'fp', 'accuracy_tp', 'accuracy_tp', 'map']

        # cat _sub to string __sub
        __sub = ""
        for s in _sub:
            __sub = __sub + ", " + s
        __sub = __sub[2:]
        # execute a statement
        print('id:', id)
        sql = f"""SELECT {__sub} FROM {TABLE_NAME}"""
        if id:
            sql = f"""SELECT {__sub} FROM {TABLE_NAME} WHERE id={id}"""
        cur.execute(sql)
        allData = cur.fetchall()
        cur.close()

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


@app.post("/jobSubmit")
async def jobSubmit(uid: int = Form(), job_type: str = Form(), url_api: str = Form(), db_name: str = Form()):
    try:
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()

        record = (uid, job_type, url_api, db_name, 'now')
        # execute a statement
        sql = f"""
            INSERT INTO {TABLE_NAME} (uid, job_type, url_api, db_name, start_time) 
            values (%s, %s, %s, %s, %s);
        """
        cur.execute(sql, record)

        conn.commit()
        cur.close()

        return jsonable_encoder({
            'status': 'success'
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


@app.delete("/deleteJob/{id}")
# @app.delete("/deleteJob")
def deleteJob(id: Union[int, None] = None):
    try:
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()

        # execute a statement
        sql = f"""DELETE FROM {TABLE_NAME} WHERE id=%s"""

        cur.execute(sql, (id,))
        conn.commit()
        cur.close()

        return jsonable_encoder({
            'status': 'success'
        })
    except Exception as e:
        print(e)
        return jsonable_encoder({
            'status': 'fail',
            "error": str(e)
        })

    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8001, reload=True)
