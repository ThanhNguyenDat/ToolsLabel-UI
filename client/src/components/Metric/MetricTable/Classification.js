import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Col, Row, Table } from 'antd';
import React from 'react';

import { uniqBy } from './util';
import styles from './MetricTable.scss';
// import databaseRequest from '~/utils/databaseRequest';
// import * as resultClassificationService from '~/services/resultClassificationService';

import axios from 'axios';

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

    const columns = [
        {
            title: 'Accuracy',
            dataIndex: 'accuracy',
        },
        {
            title: 'Precision',
            dataIndex: 'precision',
        },
        {
            title: 'Recall',
            dataIndex: 'recall',
        },

        {
            title: 'F1 Score',
            dataIndex: 'f1Score',
        },

        {
            title: 'AUC-ROC',
            dataIndex: 'aucRoc',
        },
        {
            title: 'LogLoss',
            dataIndex: 'logLoss',
        },
    ];

    return <Table columns={columns} dataSource={data} pagination={false} />;
}

// Detail Result Table
function DetailResult() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState();

    useEffect(() => {
        const url = 'http://localhost:8001/getClassficationBlaBla'

        const fetchApi = async () => {
            setLoading(true);
            let result = await axios.get(url);
            result = result.data;

            console.log('result: ', result);

            setResult(result);
            setLoading(false);
        };

        fetchApi();

    }, [])

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

    const columns = [
        {
            title: 'URL Image',
            dataIndex: 'url_image',
        },
        {
            title: 'Label',
            dataIndex: 'class_label',
            filters: uniqBy(
                data.map((a) => ({
                    text: a.class_label.toString(),
                    value: a.class_label.toString(),
                })),
                JSON.stringify,
            ),

            onFilter: (value, record) => {
                if (typeof record.class_label !== 'string') {
                    record.class_label = String(record.class_label);
                }
                return record.class_label.startsWith(value);
            },
            filterSearch: true,
        },
        {
            title: 'Predict',
            dataIndex: 'predict_1',
            filters: uniqBy(
                data.map((a) => ({
                    text: a.predict_1.toString(),
                    value: a.predict_1.toString(),
                })),
                JSON.stringify,
            ),

            onFilter: (value, record) => {
                if (typeof record.predict_1 !== 'string') {
                    record.predict_1 = String(record.predict_1);
                }
                return record.predict_1.startsWith(value);
            },
            filterSearch: true,
        },
        {
            title: 'Conferences',
            dataIndex: 'conferences_1',
            sorter: (a, b) => a.conferences_1 - b.conferences_1,
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
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 50 }}
            scroll={{ y: 240 }}
            onChange={onChange}
        />
    );
}

function Classification(values) {
    console.log('values_classfication: ', values)
    return (
        <div>
            <Row>
                <h2>Summary</h2>
                <div className={cx('table-summary-result')}>
                    <SumResult />
                </div>
            </Row>
            <Row>
                <h2>Detail</h2>
                <DetailResult />
            </Row>
        </div>
    );
}

export default Classification;
