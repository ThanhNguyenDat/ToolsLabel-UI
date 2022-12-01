import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import 'antd/dist/antd.css';
import { Button, Cascader, Form, Radio, Select, Divider, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import Input from 'antd/lib/input/Input';
import axios from 'axios';

import styles from './Benchmark.scss';
import { typeMetric } from '~/resources';
import { BenchmarkServer } from '~/components/BenchmarkServer';

// import { UploadFile } from '~/components/UploadFile';
const cx = classNames.bind(styles);

function Benchmark() {
    const [form] = Form.useForm();
    const [uiDB, setUIDB] = useState();

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

    // submit data
    const fetchJobsAPISubmit = async (values) => {
        const formData = new FormData();

        // 'uid', 'job_type', 'dataset_id',
        // 'url_api', 'start_time

        if (values) {
            formData.append('uid', 123);
            formData.append('job_type', values.job_type);
            formData.append('dataset_id', values.dataset_id);
            formData.append('url_api', values.url_api);

            const url = 'http://0.0.0.0:8001/jobSubmit';
            const data = await axios.post(url, formData);
            console.log('Called API: ', data);
            if (data.data.status === 'success') {
                success(messageAPI);
            } else error(messageAPI);
        } else error(messageAPI);
    };

    const onTypeDBChange = (e) => {
        const type = e.target.value;
        if (type === 'server') {
            setUIDB(<BenchmarkServer />);
        } else if (type === 'upload') {
            setUIDB(
                <Upload.Dragger
                    accept=".csv"
                    multiple={false}
                    action="API_UPLOAD"
                    onChange={(e) => {
                        console.log(e);
                    }}
                >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload.Dragger>,
            );
        }
    };

    const onFinish = (values) => {
        console.log('values: ', values);
        fetchJobsAPISubmit(values);
        onReset(values);
    };

    const onReset = (values) => {
        form.resetFields();
        setUIDB(<BenchmarkServer />);
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
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Database" name="dataset_id    " va>
                        {uiDB || <BenchmarkServer />}
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
            <div>
                <Progress
                    percent={progress}
                    strokeColor={{
                        from: '#108ee9',
                        to: '#87d068',
                    }}
                />
                {/* {uiResult} */}
            </div>
        </div>
    );
}

export default Benchmark;
