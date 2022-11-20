import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Col, Row, Table, Divider } from 'antd';
import React from 'react';

import { uniqBy } from './util';
import styles from './MetricTable.scss';
// import databaseRequest from '~/utils/databaseRequest';
// import * as resultClassificationService from '~/services/resultClassificationService';

import axios from 'axios';
import Column from 'antd/lib/table/Column';

const cx = classNames.bind(styles);

function SumResult() {
    const data = [
        {
            key: '1',
            accuracy: 0.9,
            precision: 0.11,
            recall: 0.12,
            f1Score: 0.13,
            aucRoc: 0.14,
            logLoss: 0.14,
        },
    ];

    return (
        <Table dataSource={data} pagination={false}>
            <Column title="Accuracy" dataIndex="accuracy" />
            <Column title="Precision" dataIndex="precision" />
            <Column title="Recall" dataIndex="recall" />
            <Column title="F1 Score" dataIndex="f1Score" />
            <Column title="AUC-ROC" dataIndex="aucRoc" />
            <Column title="LogLoss" dataIndex="logLoss" />
        </Table>
    );
}

// Detail Result Table
function DetailResult() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState();

    const fetchApi = async (id) => {
        setLoading(true);
        const url = 'http://localhost:8002/getResult';
        const result = await axios.get(url);

        console.log('result: ', result.data);

        setResult(result.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const data = [
        {
            key: '1',
            url_image: 'img1.png',
            class_label: '1',
            predict_1: '1',
            conferences_1: 0.1,
        },
        {
            key: '2',
            url_image: 'img2.png',
            class_label: '2',
            predict_1: '2',
            conferences_1: 0.2,
        },
        {
            key: '3',
            url_image: 'img3.png',
            class_label: '2',
            predict_1: '1',
            conferences_1: 0.3,
        },
        {
            key: '4',
            url_image: 'img4.png',
            class_label: '2',
            predict_1: '2',
            conferences_1: 0.4,
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
        console.log(
            'Map: ',
            data.map((a) => ({
                text: a.predict_1,
                value: a.predict_1,
            })),
        );
    };

    return (
        <Table
            // columns={columns}
            dataSource={result}
            pagination={{ pageSize: 10 }}
            // scroll={{ y: 240 }}
            onChange={onChange}
            loading={loading}
        >
            <Column title="URL Image" dataIndex="url_image" />
            <Column
                title="Label"
                dataIndex="class_label"
                filters={uniqBy(
                    data.map((a) => ({
                        text: a.class_label.toString(),
                        value: a.class_label.toString(),
                    })),
                    JSON.stringify,
                )}
                onFilter={(value, record) => {
                    if (typeof record.class_label !== 'string') {
                        record.class_label = String(record.class_label);
                    }
                    return record.class_label.startsWith(value);
                }}
                filterSearch={true}
            />
            <Column
                title="Predict"
                dataIndex="predict_1"
                filters={uniqBy(
                    data.map((a) => ({
                        text: a.predict_1.toString(),
                        value: a.predict_1.toString(),
                    })),
                    JSON.stringify,
                )}
                onFilter={(value, record) => {
                    if (typeof record.predict_1 !== 'string') {
                        record.predict_1 = String(record.predict_1);
                    }
                    return record.predict_1.startsWith(value);
                }}
                filterSearch={true}
            />
            <Column
                title="Conferences"
                dataIndex="conferences_1"
                sorter={(a, b) => a.conferences_1 - b.conferences_1}
            />
        </Table>
    );
}

function Classification(values, id) {
    console.log('values_classfication: ', values, id);
    return (
        <div>
            <Row>
                <Divider orientation="left">Summary</Divider>
                <div className={cx('table-summary-result')}>
                    <SumResult />
                </div>
            </Row>
            <Row>
                <Divider orientation="left">Detail</Divider>
                <DetailResult />
            </Row>
        </div>
    );
}

export default Classification;
