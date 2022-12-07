from typing import Union

from fastapi import FastAPI
from fastapi import File, FastAPI

import uvicorn
import numpy as np

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.encoders import jsonable_encoder
from fastapi import Response
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


@app.get("/getResult")
async def getResult(response: Response, id: Union[int, None] = None):
    # response.headers["X-Cat-Dog"] = "alone in the world"
    # return "blabla"
    try:

        params = config()

        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)
        # create a cursor
        cur = conn.cursor()
        _sub = ['id', 'uid', 'job_type', 'dataset_id',
                'url_api', 'progress', 'score', 'start_time', 'end_time']

        __sub = ""
        for s in _sub:
            __sub = __sub + ", " + s
        __sub = __sub[2:]
        # execute a statement
        print('id:', id)
        sql = f"""SELECT {__sub} FROM "Jobs"; """
        if id:
            sql = f"""SELECT {__sub} FROM "Jobs" WHERE id={id};"""
        cur.execute(sql)
        allData = cur.fetchall()
        cur.close()

        allData = [{
            _sub[i]: data[i] for i in range(len(_sub))
        } for data in allData]

        print(allData)

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
async def jobSubmit(uid: int = Form(), job_type: str = Form(), dataset_id: int = Form(), url_api: str = Form()):
    try:
        params = config()

        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)
        # conn = psycopg2.connect()

        # create a cursor
        cur = conn.cursor()

        record = (uid, job_type, dataset_id, url_api, 'now')
        # execute a statement
        sql = f"""
            INSERT INTO "Jobs" (uid, job_type, dataset_id,
                url_api, start_time) 
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


@app.delete("/deleteJob/{id}")
# @app.delete("/deleteJob")
def deleteJob(id: Union[int, None] = None):
    try:
        params = config()

        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()

        # execute a statement
        sql = f"""
        DELETE FROM "Jobs" WHERE id=%s; 
        DELETE FROM "ResultItems" WHERE job_id=%s;
        """
        cur.execute(sql, (id, id, ))
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


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8001, reload=True)
