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


def list2str(lst):
    s = ""
    for i in lst:
        s = s + ", " + i
    return s[2:]


@app.get("/getJobs")
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

        __sub = list2str(_sub)
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


@app.get("/getDataset")
async def getDataset():
    try:
        params = config()

        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()
        _sub = ["id", "dataset_name", "dataset_type"]
        __sub = list2str(_sub)
        # execute a statement
        sql = f"""SELECT {__sub} FROM "Dataset" """
        cur.execute(sql)
        allData = cur.fetchall()

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

    finally:
        if conn is not None:
            conn.close()


@app.get("/getDatasetItems")
async def getDataItems(dataset_id: Union[int, None] = None):
    try:
        params = config()

        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()
        _sub = ['dataset_id', 'url_image', 'label']
        __sub = list2str(_sub)

        # execute a statement
        sql = f"""SELECT {__sub} FROM "DatasetItems" """
        if dataset_id:
            sql = f"""SELECT {__sub} FROM "DatasetItems" WHERE dataset_id = {dataset_id}"""
        cur.execute(sql)
        allData = cur.fetchall()

        allData = [{
            _sub[i]: data[i] for i in range(len(_sub))
        } for data in allData]

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


@app.get("/getResultItems")
async def getResultItems(job_id: Union[int, None] = None, dataset_id: Union[int, None] = None):
    try:
        params = config()

        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()
        _sub = ['"ResultItems"."id"', 'job_id',
                '"datasetItem_id"', 'url_image', 'label', 'predict']
        __sub = list2str(_sub)

        # execute a statement
        sql = f"""SELECT {__sub} from "ResultItems" JOIN "DatasetItems" ON "ResultItems"."datasetItem_id" = "DatasetItems"."id" WHERE "ResultItems"."job_id"={job_id}; """
        print(sql)
        cur.execute(sql)
        allData = cur.fetchall()

        allData = [{
            _sub[i]: data[i] for i in range(len(_sub))
        } for data in allData]

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
