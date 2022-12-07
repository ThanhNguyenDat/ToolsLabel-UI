from typing import Union
import io
import json
from PIL import Image
import torch
import asyncio
import urllib3
import uvicorn
import base64
import cv2
import numpy as np
import requests
import PIL

from config import config
import psycopg2


def list2str(lst: list) -> str:
    s = ""
    for i in lst:
        s = s + ", " + i
    s = s[2:]
    return s


def parseQuery(tableName: str = None, columns: list = None, conditions: str = None, insert_flag=False, update_flag=False) -> str:
    _columns = list2str(columns)
    # execute a statement
    if insert_flag:
        _values = f'({("%s, " * len(columns)).strip()[:-1]})'
        sql = f"""INSERT INTO "{tableName}"({_columns}) VALUES {_values};"""
    elif update_flag:
        sql = f"""UPDATE "{tableName}" SET {_columns} = %s WHERE {conditions}"""
    elif conditions:
        sql = f"""SELECT {_columns} FROM "{tableName}" WHERE {conditions}"""
    else:
        sql = f"""SELECT {_columns} FROM "{tableName}" """

    return sql


def getDataFromDatabase(database_name: str = None, columns: list = None, conditions: str = None):
    try:
        params = config()

        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()
        # columns = ["id", "dataset_id", "url_api"]
        # sql = parseQuery(columns, "Jobs")
        sql = parseQuery(database_name, columns, conditions)
        cur.execute(sql)
        allData = cur.fetchall()
        cur.close()
        # # convert tuple to list
        # allData = [list(data) for data in allData]
        # print(allData)

        allData = [{
            columns[i]: data[i] for i in range(len(columns))
        } for data in allData]
        return {
            'status': 'success',
            'data': allData
        }
    except Exception as e:
        print(e)
        return {
            'status': 'fail',
            'error': e
        }
    finally:
        if conn is not None:
            conn.close()


def insertDataIntoDatabase(database_name: str = None, columns: list = None, values: tuple = None):
    try:
        params = config()

        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()

        sql = parseQuery(database_name, columns, insert_flag=True)
        cur.execute(sql, values)
        conn.commit()
        cur.close()
        print(f"insert {database_name} successfully")

        return {
            'status': 'success'
        }
    except Exception as e:
        print(f'insert {database_name} fail with error: {e}')
        return {
            'status': 'fail',
            'error': e
        }
    finally:
        if conn is not None:
            conn.close()


def updateDataFromDatabase(database_name: str = None, columns: list = None, conditions: str = None, values: tuple = None):
    try:
        params = config()

        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()
        sql = parseQuery(database_name, columns,
                         conditions, update_flag=True)
        cur.execute(sql, values)
        conn.commit()
        cur.close()
        print(f"update {database_name} successfully")
        return {
            'status': 'success'
        }
    except Exception as e:
        print(f'update {database_name} fail with error: {e}')
        return {
            'status': 'fail',
            'error': e
        }
    finally:
        if conn is not None:
            conn.close()


def url_ok(url, method='POST'):
    if url[:4] != 'http':
        return False

    # import urllib3
    # http = urllib3.PoolManager(timeout=3.0)
    # r = http.request(
    #     method, 'http://localhost:8003/classification', retries=False
    # )

    # print(dir(r))
    # print(r.status)

    # r = requests.post(url, data=None).status_code
    # print("status code: ", r)

    return True
