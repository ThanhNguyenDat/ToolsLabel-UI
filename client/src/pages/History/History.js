import { Row, Table } from "antd";

const columns = [
    {
        title: 'Title 1',
        dataIndex: 'title_1'
    },
    {
        title: 'Title 2',
        dataIndex: 'title_2'
    }
]

const data = [
    {
        title_1: 1,
        title_2: 2
    },
    {
        title_1: 1,
        title_2: 2
    },
]

function History() {
    return ( 
    <Row>
        <Table columns={columns} dataSource={data}/>
    </Row>
    );
}

export default History;