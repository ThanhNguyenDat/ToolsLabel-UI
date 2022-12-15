import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Row, Table, Divider } from 'antd';
import React from 'react';

import { uniqBy } from './util';
import styles from './MetricTable.scss';
// import databaseRequest from '~/utils/databaseRequest';
// import * as resultClassificationService from '~/services/resultClassificationService';

import axios from 'axios';
import Column from 'antd/lib/table/Column';
import { GET_JOBS_URL, GET_RESULT_ITEMS_URL } from '~/config';

const cx = classNames.bind(styles);

function SumResult({ job_id }) {
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchApi = async () => {
        setLoading(true);
        const params = {
            params: {
                id: job_id,
            },
        };
        const _result = await axios.get(`${GET_JOBS_URL}`, params);
        if (_result.data.status === 'success') {
            const score = JSON.parse(_result.data.data[0]['score']);
            delete score['classification_report']['accuracy'];
            const classification_report = score['classification_report'];
            const data = Object.keys(classification_report).map((key, index) => {
                return {
                    obj: key,
                    precision: classification_report[key]['precision'],
                    recall: classification_report[key]['recall'],
                    f1_score: classification_report[key]['f1-score'],
                    support: classification_report[key]['support'],
                };
            });

            setMetrics({ data: data });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchApi();
    }, []);

    return (
        <Table dataSource={metrics.data} pagination={false} loading={loading}>
            <Column title="#" dataIndex="obj" />
            <Column title="Precision" dataIndex="precision" />
            <Column title="Recall" dataIndex="recall" />
            <Column title="F1 Score" dataIndex="f1_score" />
            <Column title="Support" dataIndex="support" />
        </Table>
    );
}

// Detail Result Table
function DetailResult({ job_id, dataset_id }) {
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState([]);
    const fetchApi = async () => {
        setLoading(true);

        const params = {
            params: {
                job_id: job_id,
            },
        };

        const datasetItems = await axios.get(`${GET_RESULT_ITEMS_URL}`, params);

        if (datasetItems.data.status === 'success') {
            setDetails(datasetItems.data.data);
        }

        // Show predict

        setLoading(false);
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
        console.log(
            'Map: ',
            details.map((a) => ({
                text: a.predict_1,
                value: a.predict_1,
            })),
        );
    };

    return (
        <Table
            dataSource={details}
            // pagination={{ pageSize: 20 }}
            // scroll={{ y: 240 }}
            onChange={onChange}
            loading={loading}
        >
            <Column
                title="URL Image"
                dataIndex="url_image"
                render={(text) => (
                    <a href={text} target="_blank" rel="noreferrer">
                        {text}
                    </a>
                )}
            />
            <Column
                title="Label"
                dataIndex="label"
                filters={uniqBy(
                    details.map((a) => ({
                        text: a.label?.toString(),
                        value: a.label?.toString(),
                    })),
                    JSON.stringify,
                ).sort((a, b) => {
                    return a.text - b.text;
                })}
                onFilter={(value, record) => {
                    if (typeof record.label !== 'string') {
                        record.label = String(record.class_label);
                    }
                    return record.label.startsWith(value);
                }}
                filterSearch={true}
            />
            <Column
                title="Predict"
                dataIndex="predict"
                filters={uniqBy(
                    details.map((a) => ({
                        text: a.predict?.toString(),
                        value: a.predict?.toString(),
                    })),
                    JSON.stringify,
                ).sort((a, b) => {
                    return a.text - b.text;
                })}
                onFilter={(value, record) => {
                    if (typeof record.predict_1 !== 'string') {
                        record.predict_1 = String(record.predict_1);
                    }
                    return record.predict_1.startsWith(value);
                }}
                filterSearch={true}
            />
        </Table>
    );
}

function Classification({ job_id, dataset_id }) {
    console.log('values_classfication: ', job_id, dataset_id);
    return (
        <div>
            <Row>
                <Divider orientation="left">Summary</Divider>
                <div className={cx('table-summary-result')}>
                    <SumResult job_id={job_id} />
                </div>
            </Row>
            <Row>
                <Divider orientation="left">Detail</Divider>
                <DetailResult job_id={job_id} dataset_id={dataset_id} />
            </Row>
        </div>
    );
}

export default Classification;
