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

const cx = classNames.bind(styles);

function SumResult(id) {
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchApi = async () => {
        setLoading(true);
        const url = 'http://localhost:8001/getResult';
        const params = {
            params: {
                id: id.id,
            },
        };
        const _result = await axios.get(url, params);
        if (_result.data.status === 'success') {
            setMetrics({ data: _result.data.data });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchApi();
    }, []);

    return (
        <Table dataSource={metrics.data} pagination={false} loading={loading}>
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
function DetailResult(id_job) {
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState([]);

    const fetchApi = async () => {
        setLoading(true);

        const url = 'http://localhost:8002/getResult';
        const params = {
            params: {
                id_job: id_job.id_job,
            },
        };
        const _result = await axios.get(url, params);

        console.log('result_detail: ', _result.data);
        if (_result.data.status === 'success') {
            setDetails(_result.data.data);
        }
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
            <Column title="URL Image" dataIndex="url_image" render={(text) => <a href={text}>{text}</a>} />
            <Column
                title="Label"
                dataIndex="class_label"
                filters={uniqBy(
                    details.map((a) => ({
                        text: a.class_label?.toString(),
                        value: a.class_label?.toString(),
                    })),
                    JSON.stringify,
                ).sort((a, b) => {
                    return a.text - b.text;
                })}
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
                    details.map((a) => ({
                        text: a.predict_1?.toString(),
                        value: a.predict_1?.toString(),
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
            <Column
                title="Conferences"
                dataIndex="conferences_1"
                sorter={(a, b) => a.conferences_1 - b.conferences_1}
            />
        </Table>
    );
}

function Classification(props) {
    console.log('values_classfication: ', props);
    return (
        <div>
            <Row>
                <Divider orientation="left">Summary</Divider>
                <div className={cx('table-summary-result')}>
                    <SumResult id={props.id} />
                </div>
            </Row>
            <Row>
                <Divider orientation="left">Detail</Divider>
                <DetailResult id_job={props.id} />
            </Row>
        </div>
    );
}

export default Classification;
