FROM python:3.8

WORKDIR /code

COPY ./requirements.txt /code/api/requirements.txt

RUN pip install --no-cache-dir -r /code/api/requirements.txt

COPY ./api /code/api

CMD ["uvicorn", "api.object_detection.api:app", "--host", "0.0.0.0", "80"]