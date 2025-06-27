import React, { useState } from 'react';
import fileService from '../../services/fileService'
import debug from "sabio-debug"
import PropTypes from "prop-types"

function UploadFile(props) {

  const [files, setFiles] = useState([]);
  const _logger = debug.extend("UploadFile")

  const uploadFileHandler = (e) => {
    setFiles(e.target.files);
  };

  const fileSubmitHandler = (e) => { 
    e.preventDefault();
    const formData = new FormData();

    for (let index = 0; index < files.length; index++) {
      formData.append(`files`, files[index])
    }

    fileService
      .uploadFiles(formData)
      .then(onUploadFileSuccess)
      .catch(onUploadFileError) 
  }

  const onUploadFileSuccess = (response) => {
    _logger(response.id, "This is the uploadfile response");
    props.getResponseFile(response.id)
  }

  const onUploadFileError = (error) => {
    _logger({ error: error }, 'Error while uploading file!');
  }

  return (

    <form onSubmit={fileSubmitHandler}>
      <input className="form-control w-50 d-inline me-3" type="file" multiple onChange={uploadFileHandler} />
      <button className="btn btn-primary" type='submit'>Upload</button>
    </form>

  );
}
export default UploadFile;

UploadFile.propTypes = {
  getResponseFile: PropTypes.func.isRequired
}
