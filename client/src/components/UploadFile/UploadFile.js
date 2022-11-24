import { UploadOutlined } from '@ant-design/icons';
import { Upload, Button } from 'antd';

function UploadFile(...passProps) {
    const props = {
        ...passProps,
    };
    return (
        <Upload.Dragger {...props} accept=".csv" multiple={false} action="API_UPLOAD">
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload.Dragger>
    );
}

export default UploadFile;
