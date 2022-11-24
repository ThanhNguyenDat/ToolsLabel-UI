import { useEffect, useState } from 'react';
import { QuestionCircleOutlined, PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import { Table, Button, Popconfirm, message } from 'antd';
import axios from 'axios';

import Classification from '~/components/Metric/MetricTable/Classification';
import ObjeactDetection from '~/components/Metric/MetricTable/ObjeactDetection';
import Column from 'antd/lib/table/Column';

function History({ values }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messageAPI, contextHolder] = message.useMessage();
    const success = () => {
        messageAPI.open({
            type: 'success',
            content: 'Delete successfully',
        });
    };
    const error = () => {
        messageAPI.open({
            type: 'error',
            content: 'This is an error message',
        });
    };
    const warning = () => {
        messageAPI.open({
            type: 'warning',
            content: 'This is a warning message',
        });
    };

    const fetchJobsAPISubmit = async () => {
        // call api
        setLoading(true);
        const url = 'http://0.0.0.0:8001/getResult';
        const result = await axios.get(url);
        console.log('Called API: ', result.data);
        if (result.data.status === 'success') {
            setJobs({ data: result.data.data });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchJobsAPISubmit();
    }, []);

    const expandTypeJobRender = (record) => {
        if (record.job_type === 'classification') {
            return <Classification values={values} id={record.id} />;
        } else if (record.job_type === 'object_detection') {
            return <ObjeactDetection values={values} id={record.id} />;
        }
    };

    const expandIcon = ({ expanded, onExpand, record }) => {
        // if (record.id > 5) return null;
        return expanded ? (
            <MinusCircleTwoTone
                onClick={(e) => {
                    onExpand(record, e);
                }}
            />
        ) : (
            <PlusCircleTwoTone
                onClick={(e) => {
                    onExpand(record, e);
                }}
            />
        );
    };

    const onConfirmDeleteJob = async (record) => {
        // fetchDelete(record);

        const url = 'http://0.0.0.0:8001/deleteJob/' + record.id;
        console.log(url);
        const result = await axios.delete(url);
        console.log('status: ', result.data.status);
        if (result.data.status === 'success') {
            const filteredJobs = jobs.data.filter((job) => job.id !== record.id);
            setJobs({ data: [...filteredJobs] });
            success();
        }
    };

    return (
        <>
            {contextHolder}
            <Table
                dataSource={jobs.data}
                rowKey="id"
                loading={loading}
                expandable={{
                    rowExpandable: (record) => true, //record.id < 5,
                    expandedRowRender: expandTypeJobRender,
                    defaultExpandAllRows: false,
                    expandIcon: expandIcon,
                }}
            >
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
                                    onConfirmDeleteJob(record);
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
        </>
    );
}

export default History;
