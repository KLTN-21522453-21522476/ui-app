import React from 'react';
import { Spinner } from 'react-bootstrap';
import { FilePreviewProps } from '../../../types/FileList';

const FilePreview: React.FC<FilePreviewProps> = ({ file, width = "150px", height = "150px" }) => {
  return (
    <div className="position-relative">
      <img
        src={file.preview}
        alt={file.name}
        style={{
          width: width,
          height: height,
          objectFit: "cover",
          marginRight: "10px",
          opacity: file.status === 'loading' ? 0.5 : 1
        }}
      />
      {file.status === 'loading' && (
        <div 
          className="position-absolute d-flex justify-content-center align-items-center"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      {file.status === 'error' && (
        <div 
          className="position-absolute d-flex justify-content-center align-items-center"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 0, 0, 0.2)'
          }}
        >
          <span className="text-danger">Trích xuất thất bại</span>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
