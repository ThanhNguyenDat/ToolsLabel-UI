import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import 'antd/dist/antd.css';
import { Button, Cascader, Form, Radio, Select, Divider, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import Input from 'antd/lib/input/Input';
import axios from 'axios';

import styles from './Benchmark.scss';
import { database_source, typeMetric } from '~/resources';

// import { UploadFile } from '~/components/UploadFile';
const cx = classNames.bind(styles);

function Benchmark() {
    const [form] = Form.useForm();
    const [uiDB, setUIDB] = useState();

    const [fileCSV, setFileCSV] = useState();
    const [array, setArray] = useState([]);
    const [loadingCSV, setLoadingCSV] = useState(false);

    const [progress, setProgress] = useState(0);
    const [messageAPI, contextMsg] = message.useMessage();
    const success = (messageAPI) => {
        messageAPI.open({
            type: 'success',
            content: 'Submit successfully',
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

        if (values) {
            // console.log('type: ', values.job_type);

            formData.append('uid', 123);
            formData.append('url_api', values.url_api);
            formData.append('db_name', values.db_name);
            formData.append('job_type', values.job_type);

            const url = 'http://0.0.0.0:8001/jobSubmit';
            const data = await axios.post(url, formData);
            console.log('Called API: ', data);
            if (data.data.status === 'success') {
                success(messageAPI);
            }
        }
    };

    const onTypeDBChange = (e) => {
        const type = e.target.value;
        console.log('Type: ', type);

        if (type === 'typing') {
            setUIDB(<Input placeholder={'http://example-api.com'} />);
        } else if (type === 'server') {
            setUIDB(<Cascader options={database_source} />);
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
        setUIDB(<Cascader options={database_source} />);
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

                    <Form.Item label="Database" name="db_name" va>
                        {uiDB || <Cascader options={database_source} />}
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
