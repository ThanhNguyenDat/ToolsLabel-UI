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


@app.post("/submitData/")
async def fake_api(url_api: Union[str, None] = None, data: Union[UploadFile, list, None] = None):
    try:
        allData = {
            "url_api": url_api,
            "data": data
        }

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

    # finally:
    #     if conn is not None:
    #         conn.close()
    #         print('Database connection closed.')


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8003, reload=True)
