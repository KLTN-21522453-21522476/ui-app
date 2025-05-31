import React from 'react';
import { Spinner } from 'react-bootstrap';
import { FilePreviewProps } from '../../../types/FileList';

const FilePreview: React.FC<FilePreviewProps> = ({ file, width = "120px", height = "120px" }) => {
  return (
    <div className="position-relative">
      <img
        src={file.preview}
        alt={file.name}
        style={{
          width: width,
          height: height,
          objectFit: "cover",
          borderRadius: "4px",
          opacity: file.status === 'loading' ? 0.5 : 1
        }}
        className="img-fluid"
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
          <Spinner animation="border" variant="primary" size="sm" />
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
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            borderRadius: "4px"
          }}
        >
          <span className="text-danger small">Trích xuất thất bại</span>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
