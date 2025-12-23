import React from 'react';
import CustomFileUpload from "../../../components/common/CustomFileUpload";

const FileUploads = () => {
  return (
    <>
      <div className='row row-gap-3_4'>
        <div className='col-md-6 col-lg-5 col-xl-4'>
          <div className='form-group'>
            <label className='form-label'>Upload</label>
            <CustomFileUpload name="demo[]" maxFileSize={1000000} />
          </div>
        </div>{/* <!-- Col --> */}
        <div className='col-md-6 col-lg-5 col-xl-4'>
          <div className='form-group'>
            <label className='form-label'>Upload (xls, xlsx, csv)</label>
            <CustomFileUpload name="custom[]" accept=".xlsx,.csv,.xls" maxFileSize={1000000} />
          </div>
        </div>{/* <!-- Col --> */}
      </div>{/* <!-- Row --> */}
    </>
  )
}

export default FileUploads