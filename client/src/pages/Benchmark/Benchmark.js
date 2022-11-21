import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import 'antd/dist/antd.css';
import { Button, Cascader, Form, Radio, Select, Divider, Switch, Progress } from 'antd';
import Input from 'antd/lib/input/Input';
import axios from 'axios';

import styles from './Benchmark.scss';
import { database_source, typeMetric } from '~/resources';

const cx = classNames.bind(styles);

function Benchmark() {
    const [form] = Form.useForm();

    const [componentSize, setComponentSize] = useState('default');
    const [uiDB, setUIDB] = useState();
    const [dbImport, setDBImport] = useState(true);

    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };

    const [progress, setProgress] = useState(0);

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

    const fetchJobsAPISubmit = async (values) => {
        // call api
        const formData = new FormData();

        if (values) {
            console.log('type: ', values.job_type);

            formData.append('uid', 123);
            formData.append('url_api', values.url_api);
            formData.append('db_name', values.db_name);
            formData.append('job_type', values.job_type);

            const url = 'http://0.0.0.0:8001/jobSubmit';
            const data = await axios.post(url, formData);
            console.log('Called API: ', data);
        }
    };

    const onFinish = (values) => {
        console.log('values: ', values);
        fetchJobsAPISubmit(values);
    };

    const onReset = (values) => {
        form.resetFields();
    };

    const onDBChange = () => {
        if (dbImport) {
            setUIDB(<Input placeholder={'http://example-api.com'} />);
        } else {
            setUIDB(<Cascader options={database_source} />);
        }
        setDBImport(!dbImport);
    };

    return (
        <div className={cx('wrapper')}>
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
                    initialValues={{
                        size: componentSize,
                    }}
                    onValuesChange={onFormLayoutChange}
                    size={componentSize}
                >
                    <Form.Item label="Form Size" name="size">
                        <Radio.Group defaultValue={'default'}>
                            <Radio.Button value="small">Small</Radio.Button>
                            <Radio.Button value="default">Default</Radio.Button>
                            <Radio.Button value="large">Large</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="API" name="url_api">
                        <Input placeholder="http://example-api.com" />
                    </Form.Item>
                    <Form.Item label="Type read databae" name="typeReadDB">
                        <Switch
                            checkedChildren="Server"
                            unCheckedChildren="Import"
                            defaultChecked
                            onClick={onDBChange}
                        />
                    </Form.Item>
                    <Form.Item label="Database" name="db_name">
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
