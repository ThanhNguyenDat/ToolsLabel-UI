import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="ZATools",
    user="react_fastapi",
    password="react_fastapi",
    port=5432
)

