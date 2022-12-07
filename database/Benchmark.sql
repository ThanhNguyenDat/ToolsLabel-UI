CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar,
  "password" varchar,
  "domain" varchar
);

CREATE TABLE "Dataset" (
  "id" SERIAL PRIMARY KEY,
  "dataset_name" varchar,
  "dataset_type" varchar
);

CREATE TABLE "DatasetItems" (
  "id" SERIAL PRIMARY KEY,
  "dataset_id" SERIAL,
  "url_image" varchar,
  "label" varchar
);

CREATE TABLE "ResultItems" (
  "id" SERIAL PRIMARY KEY,
  "job_id" SERIAL,
  "dataset_id" SERIAL,
  "datasetItem_id" SERIAL,
  "predict" varchar
);

CREATE TABLE "Jobs" (
  "id" SERIAL PRIMARY KEY,
  "uid" SERIAL,
  "job_type" varchar,
  "dataset_id" SERIAL,
  "url_api" varchar,
  "progress" float default 0,
  "score" varchar,
  "start_time" timestamp,
  "end_time" timestamp
);

CREATE TABLE "DatasetUpload" (
  "id" SERIAL PRIMARY KEY,
  "dataset_name" varchar,
  "dataset_type" varchar
);

CREATE TABLE "DatasetUploadItems" (
  "id" SERIAL PRIMARY KEY,
  "dataset_id" SERIAL,
  "url_image" varchar,
  "label" varchar
);

CREATE TABLE "ResultUploadItems" (
  "id" SERIAL PRIMARY KEY,
  "job_id" SERIAL,
  "datasetUploadItem" SERIAL,
  "predict" varchar
);

ALTER TABLE "DatasetItems" ADD FOREIGN KEY ("dataset_id") REFERENCES "Dataset" ("id");

ALTER TABLE "Jobs" ADD FOREIGN KEY ("uid") REFERENCES "User" ("id");

ALTER TABLE "DatasetUploadItems" ADD FOREIGN KEY ("dataset_id") REFERENCES "DatasetUpload" ("id");
