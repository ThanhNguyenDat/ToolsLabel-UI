import { useEffect, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Table, Button, Popconfirm } from 'antd';
import axios from 'axios';

import Classification from '~/components/Metric/MetricTable/Classification';
import ObjeactDetection from '~/components/Metric/MetricTable/ObjeactDetection';
import Column from 'antd/lib/table/Column';

function History({ values }) {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);

    const fetchJobsAPISubmit = async () => {
        // call api
        setLoading(true);
        const url = 'http://0.0.0.0:8001/getResult';
        const result = await axios.get(url);
        console.log('Called API: ', result.data);
        setData(result.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchJobsAPISubmit();
    }, []);

    const expandTypeJob = (record) => {
        if (record.job_type === 'classification') {
            return <Classification values={values} id={record.id} />;
        } else if (record.job_type === 'object_detection') {
            return <ObjeactDetection values={values} id={record.id} />;
        }
    };

    return (
        <div>
            <Table dataSource={data} rowKey="id" expandedRowRender={expandTypeJob} loading={loading}>
                <Column title="Id" dataIndex={'id'} />
                <Column title="Job Type" dataIndex={'job_type'} />
                <Column title="Url API" dataIndex={'url_api'} />
                <Column title="Database" dataIndex={'db_name'} />
                <Column title="start_time" dataIndex={'start_time'} />
                <Column title="end_time" dataIndex={'end_time'} />
                <Column title="status" dataIndex={'status'} />
                <Column
                    title="Action"
                    dataIndex={''}
                    key="x"
                    render={(_, record) => {
                        return (
                            <Popconfirm
                                title="Are you sure?"
                                icon={
                                    <QuestionCircleOutlined
                                        style={{
                                            color: 'red',
                                        }}
                                    />
                                }
                                onConfirm={() => {
                                    console.log(record.id);
                                }}
                            >
                                <Button
                                    type="primary"
                                    danger
                                    onClick={() => {
                                        console.log(record.id);
                                    }}
                                >
                                    Delete
                                </Button>
                            </Popconfirm>
                        );
                    }}
                />
            </Table>
        </div>
    );
}

export default History;
