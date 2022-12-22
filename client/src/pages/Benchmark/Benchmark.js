import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import 'antd/dist/antd.css';
import { Button, Form, Cascader, Radio, Select, Divider, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import Input from 'antd/lib/input/Input';
import axios from 'axios';
import Papa from 'papaparse';

import styles from './Benchmark.scss';
import { typeMetric } from '~/resources';
import { GET_DATASET_URL, JOB_SUBMIT_URL, LOCALHOST_URL } from '~/config';
import UploadCSVFile from '~/components/UploadFile/CSVFile';
// import { BenchmarkServer } from '~/components/BenchmarkServer';

// import { UploadFile } from '~/components/UploadFile';
const cx = classNames.bind(styles);

function Benchmark() {
    const [form] = Form.useForm();
    const [uiDB, setUIDB] = useState();
    const [typeReadDB, setTypeReadDB] = useState('server');
    const [data, setData] = useState([]);
    const [dataUpload, setDataUpload] = useState([]);

    const [progress, setProgress] = useState(0);
    const [messageAPI, contextMsg] = message.useMessage();

    const success = (messageAPI) => {
        messageAPI.open({
            type: 'success',
            content: 'Submit successfully',
        });
    };

    const error = (messageAPI) => {
        messageAPI.open({
            type: 'error',
            content: 'Submit error',
        });
    };

    useEffect(() => {}, [typeReadDB]);

    // xử lý progress ???
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    return 0;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        fetchAPIGetDataset();
    }, []);

    const fetchAPIGetDataset = async () => {
        const result = await axios.get(`${GET_DATASET_URL}`);
        if (result.data?.status === 'success') {
            // mapping data
            const _data = result.data.data;
            _data.forEach((value) => {
                value['value'] = value['id'];
                value['label'] = value['dataset_name'];
                delete value['dataset_name'];
            });
            setData(_data);
        }
    };

    // submit data
    const fetchJobsAPISubmit = async (values) => {
        const formDataJob = new FormData();

        if (values) {
            formDataJob.append('uid', 1);
            formDataJob.append('job_type', values.job_type);
            formDataJob.append('type_read_db', typeReadDB);
            if (typeReadDB === 'server') {
                formDataJob.append('dataset_id', parseInt(values.dataset_id));
            } else if (typeReadDB === 'upload') {
                const formDataUpload = new FormData();
                var utc = new Date().getTime();
                console.log('utc:', typeof utc);

                formDataJob.append('dataset_id', utc);

                var url_images = dataUpload.map((data) => {
                    return data[0];
                });
                var labels = dataUpload.map((data) => {
                    return data[1];
                });

                formDataUpload.append('dataset_id', utc);

                formDataUpload.append('url_images', url_images);
                formDataUpload.append('labels', labels);

                const status = await axios.post(`${LOCALHOST_URL}/uploadFile`, formDataUpload);
                console.log('status: ', status);
            }
            formDataJob.append('url_api', values.url_api);

            const data = await axios.post(`${JOB_SUBMIT_URL}`, formDataJob);
            if (data.data.status === 'success') {
                success(messageAPI);
            } else error(messageAPI);
        } else error(messageAPI);
    };

    const handleFileUpload = (e) => {
        const files = e.target.files;
        // console.log(files);
        if (files) {
            // console.log(files[0]);
            Papa.parse(files[0], {
                complete: function (results) {
                    console.log('Finished:', results.data);
                    console.log('Len: ', results.data.length);
                    setDataUpload(results.data);
                },
            });
        }
    };

    const onTypeDBChange = (e) => {
        const type = e.target.value;
        if (type === 'server') {
            // setUIDB(<BenchmarkServer />);
            setUIDB(<Cascader options={data} />);
            setTypeReadDB('server');
        } else if (type === 'upload') {
            // setUIDB(
            //     <Upload.Dragger
            //         accept=".csv"
            //         multiple={false}
            //         action="http://127.0.0.1:5000/upload"
            //         onChange={(e) => {
            //             console.log(e);
            //         }}
            //     >
            //         <Button icon={<UploadOutlined />}>Click to Upload</Button>
            //     </Upload.Dragger>,
            // );
            setUIDB(<Input type="file" accept=".csv" onChange={handleFileUpload} />);
            setTypeReadDB('upload');
        } else setUIDB(<Input />);
    };

    const onFinish = (values) => {
        console.log('values: ', values);
        console.log('typeReadDB: ', typeReadDB);
        fetchJobsAPISubmit(values);
        onReset(values);
    };

    const onReset = (values) => {
        form.resetFields();
        // setUIDB(<BenchmarkServer />);
        setTypeReadDB('server');
        setUIDB(<Cascader options={data} />);
    };

    return (
        <div className={cx('wrapper')}>
            {contextMsg}
            <Divider orientation="center">Benchmark</Divider>
            <div>
                <h2>Parameters</h2>
                <Form
                    form={form}
                    onFinish={onFinish}
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    layout="horizontal"
                >
                    <Form.Item label="API" name="url_api">
                        <Input placeholder="http://example-api.com" />
                    </Form.Item>

                    <Form.Item label="Type read database" name="typeReadDB">
                        <Radio.Group onChange={onTypeDBChange} defaultValue="server">
                            <Radio.Button value="server">Server</Radio.Button>
                            <Radio.Button value="upload">Upload</Radio.Button>
                            <Radio.Button value="typing">Typing</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Database" name="dataset_id">
                        {uiDB || <Cascader options={data} />}
                    </Form.Item>

                    <Form.Item
                        label="Job Type"
                        name="job_type"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select>
                            {typeMetric.map((type) => {
                                return (
                                    <Select.Option key={type.id} value={type.value}>
                                        {type.title}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Button">
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            {/* <div>
                <Progress
                    percent={progress}
                    strokeColor={{
                        from: '#108ee9',
                        to: '#87d068',
                    }}
                />
            </div> */}
        </div>
    );
}

export default Benchmark;
