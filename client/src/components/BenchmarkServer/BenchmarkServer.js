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
                value['value'] = value['id'];
                value['label'] = value['dataset_name'];
                delete value['dataset_name'];
            });
            setData(_data);
            console.log('database: ', _data);
        }
    };

    return (
        <>
            {/* <Cascader options={data} /> */}

            <Cascader
                options={[
                    {
                        value: 1,
                        label: 'Fake database',
                    },
                    {
                        value: 2,
                        label: 'Real db',
                    },
                ]}
            />
        </>
    );
}

export default BenchmarkServer;
