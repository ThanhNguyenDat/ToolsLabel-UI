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
            urlImage: 'img1.png',
            predict_1: '1',
            conferences_1: 0.1,
        },
        {
            key: '2',
            urlImage: 'img2.png',
            predict_1: '2',
            conferences_1: 0.2,
        },
        {
            key: '3',
            urlImage: 'img3.png',
            predict_1: '1',
            conferences_1: 0.3,
        },
        {
            key: '4',
            urlImage: 'img4.png',
            predict_1: '2',
            conferences_1: 0.4,
        },
    ];

    const columns = [
        {
            title: 'URL Image',
            dataIndex: 'urlImage',
        },

        {
            title: 'Predict',
            dataIndex: 'predict_1',
            filters: uniqBy(
                data.map((a) => ({
                    text: a.predict.toString(),
                    value: a.predict.toString(),
                })),
                JSON.stringify,
            ),

            onFilter: (value, record) => {
                if (typeof record.predict !== 'string') {
                    record.predict = String(record.predict);
                }
                return record.predict.startsWith(value);
            },
            filterSearch: true,
        },
        {
            title: 'Conferences',
            dataIndex: 'conferences_1',
            sorter: (a, b) => a.conferences - b.conferences,
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
        console.log(
            'Map: ',
            data.map((a) => ({
                text: a.predict,
                value: a.predict,
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

function Classification() {
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
