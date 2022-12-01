import { Cascader } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

function BenchmarkServer() {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetchApi();
    }, []);

    const fetchApi = async () => {
        const url = 'http://0.0.0.0:8003/getDataset';

        const result = await axios.post(url);
        if (result.data?.status === 'success') {
            // mapping data
            const _data = result.data.data;
            _data.forEach((value) => {
                value['value'] = value['dataset_name'];
                value['label'] = value['dataset_name'];
                delete value['dataset_name'];
            });
            setData(_data);
            console.log(_data);
        }
    };

    return (
        <>
            <Cascader options={data} />
        </>
    );
}

export default BenchmarkServer;
