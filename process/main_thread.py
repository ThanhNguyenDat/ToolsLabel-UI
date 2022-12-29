import time
import requests
import logging
from ailabtools.ailab_multiprocessing import pool_worker

from ControlDatabase import *
from matrix.classification import *
from utils import *
from config.constants import *

logging.basicConfig(level=logging.INFO,
                    format=FORMAT,
                    filename=FILENAME_LOG, filemode='w')
logger = logging.getLogger('process')
# d = {'clientip': '192.168.0.1', 'user': 'fbloggs'}
# logger.warning('Protocol problem: %s', 'connection reset', extra=d)


def main(job_data):
    # Jobs with progress < 1 -> id, dataset_id, url_api
    # job_datas = getDataFromDatabase(
    #     table_name="Jobs",
    #     columns=['id', 'dataset_id', 'url_api', 'progress', 'score', 'type_read_db'],
    #     logger=logger)

    # if job_datas['status'] == STATUS_SUCCESS:
    #     for job_data in job_datas['data']:
            # get information in Job's database
    job_id = job_data['id']
    dataset_id = job_data['dataset_id']
    url_api = job_data['url_api']
    progress = job_data['progress']
    score = job_data['score']
    type_read_db = job_data['type_read_db']
    
    TABLE_NAME_DATASET = "Dataset" if type_read_db == 'server' else "DatasetUpload"
    TABLE_NAME_DATASET_ITEMS = "DatasetItems"  if type_read_db == 'server' else "DatasetUploadItems"
    TABLE_NAME_RESULT_ITEMS = "ResultItems" if type_read_db == 'server' else "ResultUploadItems"
    
    # Check url api http/https
    if not urlOk(url_api):
        logger.error(f"url api fail in job_id: {job_id}")
        # continue
        return

    # If progress >= 1 (means 100%) and deal with other job
    # score = None when score'Jobs database haven't had values yet
    if progress >= 1:
        if score == None:
            # get full data
            
            sql = f"""
                SELECT "{TABLE_NAME_RESULT_ITEMS}"."id", url_image, label, predict
                FROM "{TABLE_NAME_RESULT_ITEMS}"
                    JOIN "{TABLE_NAME_DATASET_ITEMS}" ON "{TABLE_NAME_DATASET_ITEMS}"."id"="{TABLE_NAME_RESULT_ITEMS}"."dataset_item_id"
                WHERE "{TABLE_NAME_RESULT_ITEMS}"."job_id"={job_id}
                ;
            """

            label = []
            predict = []
            data = getDataFromDatabase(sql=sql, logger=logger)
            if data['status'] == STATUS_SUCCESS:
                for da in data['data']:
                    label.append(da['label'])
                    predict.append(da['predict'])

            report = calculate_score(label, predict)
            report = str(report).replace("'", '"')

            data = updateDataFromDatabase(
                table_name="Jobs",
                columns=["score"],
                conditions=f"id={job_id}",
                values=(report, ),
                logger=logger)
        # continue
        return
    # dataset_id -> url_images from DatasetItems -> List url
    datasetItems = getDataFromDatabase(
        table_name=TABLE_NAME_DATASET_ITEMS,
        columns=['id', 'url_image', 'label'],
        conditions=f"dataset_id={dataset_id}", logger=logger)
    # print(datasetItems)
    if datasetItems['status'] == STATUS_SUCCESS:

        total_image = len(datasetItems['data'])
        image_predicted = progress * total_image
        for dataItem in datasetItems['data']:
            try:
                image_predicted += 1
                new_proress = image_predicted / total_image

                # Predict and insert into ResultItems database
                data = {
                    'url_image': dataItem['url_image']
                }
                response = requests.post(
                    url_api, data=data)
                predict = response.json()
                logger.info(f"Predict: {predict}")
            except Exception as e:
                logger.exception(f"url api fail in job_id: {job_id} with error: {e}")
                break

            if predict['status'] == STATUS_SUCCESS:
                # if process = 0.1->0.9?
                data = insertDataIntoDatabase(
                    table_name=TABLE_NAME_RESULT_ITEMS,
                    columns=['job_id', 'dataset_id',
                                '"dataset_item_id"', 'predict'],
                    values=(job_id, dataset_id,
                            dataItem['id'], str(predict['data'])),
                    logger=logger)

                # Update progress of job_id
                data = updateDataFromDatabase(
                    table_name="Jobs",
                    columns=["progress"],
                    conditions=f"id={job_id}",
                    values=(new_proress, ),
                    logger=logger)

                logger.info(
                    f"Job_id: {job_id} | Dataset_id: {dataset_id} | Dataset_items_id: {dataItem['id']} | progress: {new_proress} | label: {dataItem['label']} | predict: {predict['data']}")


if __name__ == '__main__':
    while True:
        try:
            logger.warning("Starting processing")
            # main()
            job_datas = getDataFromDatabase(
                table_name="Jobs",
                columns=['id', 'dataset_id', 'url_api', 'progress', 'score', 'type_read_db'],
                logger=logger)
            if job_datas['status'] == STATUS_SUCCESS:
            # for job_data in job_datas['data']:
                pool_worker(main, job_datas['data'])
            time.sleep(3)
        except Exception as e:
            logger.exception(e)
