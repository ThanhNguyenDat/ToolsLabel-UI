import json
from config import config as configDatabase
import psycopg2
from .utils import check_key, list2str


def parseQuery(**config: dict) -> str:
    table_name = check_key(config, 'table_name')
    columns = check_key(config, 'columns')
    conditions = check_key(config, 'conditions')

    insert_flag = check_key(config, 'insert_flag')
    update_flag = check_key(config, 'update_flag')
    join_flag = check_key(config, 'join_flag')

    tableJoin = check_key(config, 'tableJoin')
    idJoin = check_key(config, 'idJoin')

    _columns = list2str(columns)

    # execute a statement
    if insert_flag:
        _values = f'({("%s, " * len(columns)).strip()[:-1]})'
        sql = f"""INSERT INTO "{table_name}"({_columns}) VALUES {_values};"""
    elif update_flag:
        sql = f"""UPDATE "{table_name}" SET {_columns} = %s WHERE {conditions}"""
    else:
        sql = f"""SELECT {_columns} FROM "{table_name}" """
        if conditions:
            sql += f""" WHERE {conditions}"""
        if join_flag:
            sql += f""" JOIN {tableJoin} ON {idJoin}"""
    return sql


def getDataFromDatabase(**config):
    try:
        params = configDatabase()

        columns = check_key(config, 'columns')
        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()
        # columns = ["id", "dataset_id", "url_api"]
        # sql = parseQuery(columns, "Jobs")
        sql = parseQuery(**config)
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


def insertDataIntoDatabase(**config):
    try:
        params = configDatabase()
        config['insert_flag'] = True
        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()
        values = check_key(config, 'values')
        sql = parseQuery(**config)
        cur.execute(sql, values)
        conn.commit()
        cur.close()
        print("insert success with :", sql)
        return {
            'status': 'success'
        }
    except Exception as e:
        return {
            'status': 'fail',
            'error': e
        }
    finally:
        if conn is not None:
            conn.close()


def updateDataFromDatabase(**config):
    try:
        params = configDatabase()
        config['update_flag'] = True
        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()
        values = check_key(config, 'values')
        sql = parseQuery(**config)
        cur.execute(sql, values)
        conn.commit()
        cur.close()
        return {
            'status': 'success'
        }
    except Exception as e:
        return {
            'status': 'fail',
            'error': e
        }
    finally:
        if conn is not None:
            conn.close()

