import time
import requests
import logging

from ControlDatabase import *
from matrix.classification import *
from utils import *
from config import *

logging.basicConfig(level=logging.INFO,
                    format=FORMAT,
                    filename=FILENAME_LOG, filemode='w')
logger = logging.getLogger('process')
# d = {'clientip': '192.168.0.1', 'user': 'fbloggs'}
# logger.warning('Protocol problem: %s', 'connection reset', extra=d)


def main():
    # Jobs with progress < 1 -> id, dataset_id, url_api
    job_datas = getDataFromDatabase(
        table_name="Jobs",
        columns=['id', 'dataset_id', 'url_api', 'progress', 'score'],
        logger=logger)

    if job_datas['status'] == STATUS_SUCCESS:
        for job_data in job_datas['data']:
            # get information in Job's database
            job_id = job_data['id']
            dataset_id = job_data['dataset_id']
            url_api = job_data['url_api']
            progress = job_data['progress']
            score = job_data['score']

            # Check url api http/https
            if not urlOk(url_api):
                logger.error(f"url api fail in job_id: {job_id}")
                continue

            # If progress >= 1 (means 100%) and deal with other job
            # score = None when score'Jobs database haven't had values yet
            if progress >= 1:
                if score == None:
                    # get full data
                    sql = f"""
                        SELECT "ResultItems"."id", url_image, label, predict
                        FROM "ResultItems"
                            JOIN "DatasetItems" ON "DatasetItems"."id"="ResultItems"."datasetItem_id"
                        WHERE "ResultItems"."job_id"={job_id}
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
                continue
            # dataset_id -> url_images from DatasetItems -> List url
            datasetItems = getDataFromDatabase(
                table_name="DatasetItems",
                columns=['id', 'url_image', 'label'],
                conditions=f"dataset_id={dataset_id}", logger=logger)
            print(datasetItems)
            if datasetItems['status'] == STATUS_SUCCESS:

                total_image = len(datasetItems['data'])
                image_predicted = progress * total_image
                for dataItem in datasetItems['data']:
                    try:
                        # Predict and insert into ResultItems database
                        data = {
                            'url_image': dataItem['url_image']
                        }
                        response = requests.post(
                            url_api, data=data)
                        predict = response.json()
                    except Exception as e:
                        logger.exception("url api fail in job_id: ", job_id)
                        break

                    if predict['status'] == STATUS_SUCCESS:
                        # if process = 0.1->0.9?
                        data = insertDataIntoDatabase(
                            table_name="ResultItems",
                            columns=['job_id', 'dataset_id',
                                     '"datasetItem_id"', 'predict'],
                            values=(job_id, dataset_id,
                                    dataItem['id'], str(predict['data'])),
                            logger=logger)

                        # Update progress of job_id
                        image_predicted += 1
                        new_proress = image_predicted / total_image
                        data = updateDataFromDatabase(
                            table_name="Jobs",
                            columns=["progress"],
                            conditions=f"id={job_id}",
                            values=(new_proress, ),
                            logger=logger)

                        logger.info(
                            f"Job_id: {job_id} | Dataset_id: {dataset_id} | progress: {new_proress} | label: {dataItem['label']} | predict: {predict['data']}")


if __name__ == '__main__':
    while True:
        try:
            logger.warning("Starting processing")
            main()
            time.sleep(3)
        except Exception as e:
            logger.exception(e)
