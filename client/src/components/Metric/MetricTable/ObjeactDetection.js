import classNames from "classnames/bind";
import 'antd/dist/antd.css';
import { Table } from 'antd';

import { uniqBy } from "./util";

const data = [
    {
        id: '1',
        tp: 1,
        fp: 0,
        accTP: 1,
        accFP: 0,
        precision: 0.13,
        recall: 0.14,
        map: 0.12,
    },
    
]

const columns = [
    {
        title: 'TP',
        dataIndex: 'tp',
    },
    {
        title: 'FP',
        dataIndex: 'fp',
    },
    {
        title: 'Accuracy TP',
        dataIndex: 'accTP',
    },
    {
        title: 'Accuracy FP',
        dataIndex: 'accFP',
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
        title: 'mAP',
        dataIndex: 'map',
    }        
];

function ObjeactDetection({ values }) {
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
  
    return (
        <Table columns={columns} dataSource={data} pagination={false} onChange={onChange} />
        );
  }

export default ObjeactDetection;