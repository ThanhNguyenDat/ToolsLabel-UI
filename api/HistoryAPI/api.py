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
async def getResult(id: Union[int, None] = None):
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
        
        sql = f"""SELECT {__sub} FROM "Jobs"; """
        if id:
            sql = f"""SELECT {__sub} FROM "Jobs" WHERE id={id};"""
        cur.execute(sql)
        allData = cur.fetchall()
        cur.close()

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
async def getResultItems(job_id: Union[int, None] = None):
    try:
        params = config()

        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()

        # get type_read_db
        sql = f"""SELECT type_read_db FROM "Jobs" WHERE id={job_id}; """
        cur.execute(sql)
        type_read_db = cur.fetchone()
        
        # TABLE_NAME_DATASET = "Dataset" if type_read_db == 'server' else "DatasetUpload"
        TABLE_NAME_DATASET_ITEMS = "DatasetItems"  if type_read_db == 'server' else "DatasetUploadItems"
        TABLE_NAME_RESULT_ITEMS = "ResultItems" if type_read_db == 'server' else "ResultUploadItems"
        
        _sub = [f'"{TABLE_NAME_RESULT_ITEMS}"."id"', 'job_id',
                '"dataset_item_id"', 'url_image', 'label', 'predict']
        __sub = list2str(_sub)

        # execute a statement
        sql = f"""SELECT {__sub} FROM "{TABLE_NAME_RESULT_ITEMS}" 
        JOIN "{TABLE_NAME_DATASET_ITEMS}" 
          ON "{TABLE_NAME_RESULT_ITEMS}"."dataset_item_id" = "{TABLE_NAME_DATASET_ITEMS}"."id" 
        WHERE "{TABLE_NAME_RESULT_ITEMS}"."job_id"={job_id}; """
        
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
async def jobSubmit(uid: int = Form(), job_type: str = Form(), type_read_db: str = Form(), dataset_id: int = Form(), url_api: str = Form()):
    try:
        params = config()

        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)
        # conn = psycopg2.connect()

        # create a cursor
        cur = conn.cursor()

        record = (uid, job_type, type_read_db, dataset_id, url_api, 'now')
        # execute a statement
        sql = f"""
            INSERT INTO "Jobs" (uid, job_type, type_read_db, dataset_id,
                url_api, start_time) 
            values (%s, %s, %s, %s, %s, %s);
        """
        cur.execute(sql, record)

        conn.commit()
        cur.close()
        print('process4')
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


@app.post("/uploadFile")
async def uploadFile(dataset_id=Form(), url_images=Form(), labels=Form()):
    try:
        params = config()
        dataset_id = int(dataset_id)
        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)
        # conn = psycopg2.connect()
        # create a cursor
        cur = conn.cursor()
        record = (dataset_id)
        # execute a statement
        sql = f"""
            INSERT INTO "DatasetUpload" (id)
            values (%s);
        """
        
        cur.execute(sql, (dataset_id,))
        # convert string to list
        url_images = url_images.split(',')
        labels = labels.split(',')

        print(url_images)
        print(labels)
        for i in range(len(url_images)-1):
            url_image = str(url_images[i]).strip()
            label = labels[i]
            
            if url_image: 
                url_image = f"'{url_image}'"
                label = f"'{label}'"
                record = (dataset_id, url_image, label)
                print("record: ", record)

                # execute a statement
                sql = f"""
                    INSERT INTO "DatasetUploadItems" (dataset_id, url_image, label)
                    values ({dataset_id}, {str(url_image)}, {label});
                """
                cur.execute(sql)
        
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


@app.delete("/deleteJob/{id}")
# @app.delete("/deleteJob")
def deleteJob(id: Union[int, None] = None):
    """
        params: id: job_id of jobs
    """
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
        DELETE FROM "ResultUploadItems" WHERE job_id=%s;
        """

        cur.execute(sql, (id, id, id, ))
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
