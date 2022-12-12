import time
import requests

from ControlDatabase import *
from matrix.classification import *
from utils import *


def main():
    # Jobs with progress < 1 -> id, dataset_id, url_api

    job_datas = getDataFromDatabase(
        table_name="Jobs",
        columns=['id', 'dataset_id', 'url_api', 'progress', 'score'])

    if job_datas['status'] == 'success':
        for job_data in job_datas['data']:

            job_id = job_data['id']
            dataset_id = job_data['dataset_id']
            url_api = job_data['url_api']
            progress = job_data['progress']
            score = job_data['score']

            # Check url api http/https
            if not urlOk(url_api):
                print(f"url api fail in job_id: {job_id}")
                continue

            # If progress >= 1 (means 100%) and deal with other job
            # score = None when score'Jobs database haven't had values yet
            if progress >= 1:
                if score != None:
                    pass
                continue

            # dataset_id -> url_images from DatasetItems -> List url
            datasetItems = getDataFromDatabase(
                table_name="DatasetItems",
                columns=['id', 'url_image', 'label'],
                conditions=f"dataset_id={dataset_id}")

            if datasetItems['status'] == 'success':
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
                        print("url api fail in job_id:", job_id)
                        break

                    if predict['status'] == 'success':
                        # if process = 0.1->0.9?
                        insertDataIntoDatabase(
                            table_name="ResultItems",
                            columns=['job_id', 'dataset_id',
                                     '"datasetItem_id"', 'predict'],
                            values=(job_id, dataset_id, dataItem['id'], str(predict['data'])))

                        # Update progress of job_id
                        image_predicted += 1
                        new_proress = image_predicted / total_image
                        updateDataFromDatabase(
                            table_name="Jobs",
                            columns=["progress"],
                            conditions=f"id={job_id}",
                            values=(new_proress, ))

                        print(
                            f"Job_id: {job_id} | Dataset_id: {dataset_id} | progress: {new_proress} | label: {dataItem['label']} | predict: {predict['data']}")



if __name__ == '__main__':
    while True:
        try:
            print("Start")
            main()
            time.sleep(3)
        except Exception as e:
            print("ERROR: ", e)
