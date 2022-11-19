import { useEffect, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Table, Button, Popconfirm } from 'antd';
import Classification from '~/components/Metric/MetricTable/Classification';
import ObjeactDetection from '~/components/Metric/MetricTable/ObjeactDetection';

function History(values) {
    const [showResults, setShowResults] = useState(false);
    const [ui, SetUI] = useState();

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
        },
        {
            title: 'Job type',
            dataIndex: 'job_type',
        },
        {
            title: 'Url API',
            dataIndex: 'url_api',
        },
        {
            title: 'Database',
            dataIndex: 'db_name',
        },
        {
            title: 'Submit time',
            dataIndex: 'submit_time',
        },
        {
            title: 'End time',
            dataIndex: 'end_time',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (_, record, index) => {
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
                    >
                        <Button
                            type="primary"
                            danger
                            onClick={() => {
                                console.log(index);
                            }}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                );
            },
        },
    ];

    const data = [
        {
            id: '1',
            job_type: 'classification',
            url_api: 'http://api_blabla:31',
            db_name: 'db1',
            submit_time: 2,
            end_time: 3,
            status: 'done',
            detail: 'none',
        },
        {
            id: '2',
            job_type: 'object_detection',
            url_api: 'http://api_blabla:31',
            db_name: 'db1',
            submit_time: 2,
            end_time: 3,
            status: 'done',
            detail: 'none',
        },
    ];

    const check_type = (record) => {
        if (record.job_type === 'classification') {
            return <Classification values={values} />;
        } else if (record.job_type === 'object_detection') {
            return <ObjeactDetection values={values} />;
        }
    };

    return (
        <div>
            <h2>Jobs</h2>
            <Table columns={columns} dataSource={data} rowKey="id" expandedRowRender={check_type} />
            {/* {showResults ? <Classification values={values} /> : null} */}
        </div>
    );
}

export default History;
