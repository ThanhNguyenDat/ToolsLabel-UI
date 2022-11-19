# 
FROM python:3.8

# 
WORKDIR /code

# 
COPY ./requirements.txt /code/requirements.txt

# 
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 
COPY ./config.py /code/config.py
COPY ./database.ini /code/database.ini
COPY ./api.py /code/api.py

# 
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "80"]