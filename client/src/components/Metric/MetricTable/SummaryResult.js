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

function SummaryResults({ job_id }) {
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

export default SummaryResults;
