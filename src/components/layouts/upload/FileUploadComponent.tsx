import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { useDispatch } from 'react-redux';
import { addFiles } from '../../../redux/slices/fileUploadSlice';
import type { FilePreview } from '../../../redux/slices/fileUploadSlice';

interface FileUploadComponentProps {
  title: string;
  description: string;
  fileListComponent?: React.ReactNode;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  title,
  description,
  fileListComponent,
}) => {
  const [hovered, setHovered] = useState(false);
  const dispatch = useDispatch();

  const onDrop = (acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map((file) => ({
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(2),
      type: file.type,
      lastModified: file.lastModified
    }));
    dispatch(addFiles(filesWithPreview));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".heic", ".pdf"],
    },
  });

  const uploadComponent = (
    <div
      {...getRootProps()}
      className="border border-dashed p-3 p-md-4 rounded"
      style={{
        borderColor: "#ddd",
        backgroundColor: "#f9f9f9",
      }}
    >
      <input {...getInputProps()} />
      <div className="mb-3">
        <img src="picture.png" alt="Upload" style={{ width: "40px", height: "40px" }} className="mb-2" />
      </div>
      <p className="text-muted small">
        Kéo thả hoặc tải hình ảnh vào đây
        <br />
        <small className="d-block mt-1">Hỗ trợ định dạng: JPG, PNG</small>
      </p>
      <Button variant="primary" size="sm" className="mt-2">
        Tải hình ảnh từ máy bạn
      </Button>
    </div>
  );

  return (
    <Container className="text-center py-4">
      <Row className="justify-content-center">
        <Col xs={12} sm={12} md={10} lg={8}>
          <h1 className="mb-3 fs-2">{title}</h1>
          <p className="text-muted px-2">{description}</p>
          <Card
            className="p-3 p-md-4 shadow-sm mx-2 mx-md-0"
            style={{
              transition: "all 0.3s ease",
              cursor: "pointer",
              transform: hovered ? "translateY(-5px)" : "translateY(0)",
              boxShadow: hovered
                ? "0px 4px 15px rgba(0, 0, 0, 0.2)"
                : "0px 2px 10px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {uploadComponent}
          </Card>

          {fileListComponent}
        </Col>
      </Row>
    </Container>
  );
};

export default FileUploadComponent;