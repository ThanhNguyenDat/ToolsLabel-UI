import json
from config.database import config as configDatabase
import psycopg2
from .utils import check_key, list2str
from config.constants import *


def parseQuery(**config: dict) -> str:
    table_name = check_key(config, 'table_name')
    columns = check_key(config, 'columns')
    conditions = check_key(config, 'conditions')

    insert_flag = check_key(config, 'insert_flag')
    update_flag = check_key(config, 'update_flag')
    join_flag = check_key(config, 'join_flag')

    table_join = check_key(config, 'table_join')
    id_join = check_key(config, 'id_join')

    logger = check_key(config, 'logger')
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
            sql += f""" JOIN {table_join} ON {id_join}"""

    logger.info(f'Query: {sql}')
    return sql


def getDataFromDatabase(**config):
    try:
        logger = check_key(config, 'logger')
        params = configDatabase()
        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()
        # columns = ["id", "dataset_id", "url_api"]
        # sql = parseQuery(columns, "Jobs")
        sql = check_key(config, 'sql')

        if not sql:
            columns = check_key(config, 'columns')
            sql = parseQuery(**config)
        else:
            columns = []
            s = False
            qList = sql.split()
            for q in qList:
                if q.upper() == 'SELECT':
                    s = True
                    continue
                if q.upper() in ['FROM']:
                    s = False
                if s == True:
                    q = q if not q[-1] == ',' else q[:-1]
                    columns.append(q)

        assert type(sql) == str, "Query must be string"
        cur.execute(sql)
        allData = cur.fetchall()
        cur.close()

        allData = [{
            columns[i]: data[i] for i in range(len(columns))
        } for data in allData]
        # else:
        #     # convert tuple to list
        #     allData = [list(data) for data in allData]
        logger.info("get data from database success")
        return {
            'status': STATUS_SUCCESS,
            'data': allData
        }
    except Exception as e:
        logger.exception(e)
        return {
            'status': STATUS_FAIL,
            'error': e
        }
    finally:
        if conn is not None:
            conn.close()


def insertDataIntoDatabase(**config):
    try:
        logger = check_key(config, 'logger')
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
        logger.info("insert success")
        return {
            'status': STATUS_SUCCESS
        }
    except Exception as e:
        logger.exception(e)
        return {
            'status': STATUS_FAIL,
            'error': e
        }
    finally:
        if conn is not None:
            conn.close()


def updateDataFromDatabase(**config):
    try:
        logger = check_key(config, 'logger')
        params = configDatabase()
        config['update_flag'] = True
        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()

        sql = check_key(config, 'sql')
        if not sql:
            sql = parseQuery(**config)
            values = check_key(config, 'values')
            cur.execute(sql, values)
        else:
            cur.execute(sql)
        conn.commit()
        cur.close()

        logger.info('update success')
        return {
            'status': STATUS_SUCCESS
        }
    except Exception as e:
        logger.exception(e)
        return {
            'status': STATUS_FAIL,
            'error': e
        }
    finally:
        if conn is not None:
            conn.close()
