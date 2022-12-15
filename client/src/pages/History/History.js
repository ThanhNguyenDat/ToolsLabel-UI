import { useEffect, useState } from 'react';
import { QuestionCircleOutlined, PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import { Table, Button, Popconfirm, message } from 'antd';
import axios from 'axios';

import Classification from '~/components/Metric/MetricTable/Classification';
import ObjeactDetection from '~/components/Metric/MetricTable/ObjeactDetection';
import Column from 'antd/lib/table/Column';
import { GET_JOBS_URL, LOCALHOST_URL } from '~/config';

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

    const fetchJobsAPIgetResult = async () => {
        // call api

        setLoading(true);

        var config = {};
        const result = await axios.get(`${GET_JOBS_URL}`, config);

        if (result.data.status === 'success') {
            setJobs({ data: result.data.data });
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchJobsAPIgetResult();
        // const timer = setInterval(() => {
        // }, 500);
        // return () => {
        //     clearInterval(timer);
        // };
    }, []);

    const expandTypeJobRender = (record) => {
        if (record.job_type === 'classification') {
            return <Classification job_id={record.id} dataset_id={record.dataset_id} />;
        } else if (record.job_type === 'object_detection') {
            return <ObjeactDetection values={record} id={record.id} />;
        }
    };

    // set icon expand table
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
        const url = `${LOCALHOST_URL}/deleteJob/` + record.id;
        const result = await axios.delete(url);
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
                <Column title="Id" dataIndex={'id'} sorter={(a, b) => a.id - b.id} />
                <Column title="Job Type" dataIndex={'job_type'} />
                <Column title="Url API" dataIndex={'url_api'} />
                <Column title="Database ID" dataIndex={'dataset_id'} />
                <Column title="Progress" dataIndex={'progress'} />
                <Column title="start_time" dataIndex={'start_time'} sorter={(a, b) => a.start_time - b.start_time} />
                <Column title="end_time" dataIndex={'end_time'} />
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
