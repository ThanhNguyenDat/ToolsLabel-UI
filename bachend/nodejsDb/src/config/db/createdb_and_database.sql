-- create database react_fastapi_img;
-- SET ROLE ZATools;
CREATE TABLE todoTask(
	task_id SERIAL PRIMARY KEY,
	name_task VARCHAR(255),
	url_task VARCHAR(255),
	description VARCHAR(255)
);

create table react_fastapi.react_fastapi_img_simple (
    id_img int, 
    path_img varchar(255), 
    flag_process boolean DEFAULT false, 
    results varchar(255)
);
