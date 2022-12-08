import time

from utils import *


def main():
    # Jobs with progress < 1 -> id, dataset_id, url_api
    job_datas = getDataFromDatabase(
        "Jobs", ['id', 'dataset_id', 'url_api', 'progress'])
    # print(job_datas)
    if job_datas['status'] == 'success':
        for job_data in job_datas['data']:

            job_id = job_data['id']
            dataset_id = job_data['dataset_id']
            url_api = job_data['url_api']
            progress = job_data['progress']

            if not url_ok(url_api):
                print(f"url api fail in job_id: {job_id}")
                continue

            # If progress >= 1 (means 100%) and deal with other job
            if progress >= 1:
                continue

            # dataset_id -> url_images from DatasetItems -> List url
            datasetItems = getDataFromDatabase(
                "DatasetItems", ['id', 'url_image', 'label'], f"dataset_id={dataset_id}")

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
                        continue

                    if predict['status'] == 'success':
                        insertDataIntoDatabase("ResultItems", ['job_id', 'dataset_id', '"datasetItem_id"', 'predict'], (
                            job_id, dataset_id, dataItem['id'], str(predict['data'])))

                        # Update progress of job_id
                        image_predicted += 1
                        new_proress = image_predicted / total_image
                        updateDataFromDatabase(
                            "Jobs", ["progress"], f"id={job_id}", (new_proress, ))

                        print(
                            f"Job_id: {job_id} | Dataset_id: {dataset_id} | progress: {new_proress} | label: {dataItem['label']} | predict: {predict['data']}")

                        if new_proress >= 1:
                            # update end_time and calculator metric
                            pass

                        # Check progress if == 1 -> calculator score (json) -> update Jobs (score) where job_id


if __name__ == '__main__':
    while True:
        try:
            print("Start")
            main()
            time.sleep(3)
        except Exception as e:
            print("ERROR: ", e)
