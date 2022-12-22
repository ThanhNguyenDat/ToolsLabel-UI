import { useRef, useState } from 'react';
import Papa from 'papaparse';

function UploadCSVFile() {
    const handleFileUpload = (e) => {
        const files = e.target.files;
        console.log(files);
        if (files) {
            console.log(files[0]);
            Papa.parse(files[0], {
                complete: function (results) {
                    console.log('Finished:', results.data);
                },
            });
        }
    };

    return (
        <>
            {/* <CSVReader ref={buttonRef} onFileLoad={handleOnFileLoad} onError={handleOnError}></CSVReader> */}
            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
        </>
    );
}

export default UploadCSVFile;
