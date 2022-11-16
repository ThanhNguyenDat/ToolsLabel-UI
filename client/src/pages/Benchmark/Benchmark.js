import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import 'antd/dist/antd.css';
import { 
    Button,
    Cascader,
    Form,
    Radio,
    Select,
    Row,
    Col,
    Divider
} from 'antd';

import styles from "./Benchmark.scss";
import Matrix from "~/components/Metric";

const cx = classNames.bind(styles);

function Benchmark() {
    const [form] = Form.useForm();

    const [componentSize, setComponentSize] = useState('default');
    const [uiResult, setUIResult] = useState();
    
    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };

    const apiNames = [
        {
            id: 1,
            title: 'Api1',
            value: 'api1',
        },
        {
            id: 2,
            title: 'Api2',
            value: 'api2',
        },
        
    ];

    const dbNames = [
        {
            value: 'sv21',
            label: 'sv21',
            children: [
                {
                value: 'faceId',
                label: 'FaceID',
                },
            ],
        },

        {
            value: 'sv22',
            label: 'sv22',
            children: [
                {
                    value: 'blur',
                    label: 'Blur',
                },
                {
                    value: 'closedEye',
                    label: 'Closed Eye'
                }
            ],  
        }
    ]

    const typeMatrixs = [
        {
            id: 1,
            title: 'Object Detection',
            value: 'objectdetection'
        },
        {
            id: 2,
            title: 'Classification',
            value: 'classification'
        }
    ]

   
    const onFinish = (values) => {
        // console.log(values);
        setUIResult(
            <div className={cx('uiResult')}>
                <h2>Result</h2>
                <Matrix values={values}/>
            </div>
        )
        // if (values.type === 'objectdetection') {
        //     setUIResult(
        //         <Matrix values={values}/>
        //     )
        // }
        // else if (values.type === 'classification') {
        //     setUIResult(
        //         <Matrix values={values}/>
        //     )
        // }

    };
    
    const onReset = (values) => {
        form.resetFields();
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
                        <Radio.Group defaultValue={"default"}>
                        <Radio.Button value="small">Small</Radio.Button>
                        <Radio.Button value="default">Default</Radio.Button>
                        <Radio.Button value="large">Large</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    
                    <Form.Item 
                        label="API" 
                        name="apiName" 
                        >
                        <Select>
                            {apiNames.map((apiName) => {
                                return <Select.Option key={apiName.id} value={apiName.value}>{apiName.title}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item 
                        label="Database" 
                        name="dbName" 
                        >
                        <Cascader
                        options={dbNames}
                        />
                    </Form.Item>
                    
                    <Form.Item 
                        label="Type" 
                        name="type"
                        rules={[
                            {
                                required: true,
                            }
                        ]}
                        >
                        <Select>
                            {typeMatrixs.map((type) => {
                                return <Select.Option key={type.id} value={type.value}>
                                        {type.title}
                                    </Select.Option>
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
                {uiResult}
            </div> 
        </div>
     );
}

export default Benchmark;
