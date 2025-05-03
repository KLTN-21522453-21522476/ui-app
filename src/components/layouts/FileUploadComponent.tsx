import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { FileUploadComponentProps } from "../../types/UploadeFile";

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  title,
  description,
  onAddFiles,
  fileListComponent,
}) => {
  // State for hover effect
  const [hovered, setHovered] = useState(false);

  // Dropzone functionality
  const onDrop = (acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(2),
    }));
    onAddFiles(filesWithPreview);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".heic", ".pdf"],
    },
  });

  // Upload component from FileUpload.tsx
  const uploadComponent = (
    <div
      {...getRootProps()}
      className="border border-dashed p-4 rounded"
      style={{
        borderColor: "#ddd",
        backgroundColor: "#f9f9f9",
      }}
    >
      <input {...getInputProps()} />
      <div className="mb-3">
        <img src="picture.png" alt="Upload" style={{ width: "50px" }} />
      </div>
      <p className="text-muted">
        Kéo thả hoặc tải hình ảnh vào đây
        <br />
        <small>Hỗ trợ định dạng: JPG, PNG</small>
      </p>
      <Button variant="primary" className="mt-3">
        Tải hình ảnh từ máy bạn
      </Button>
    </div>
  );

  return (
    <Container className="text-center py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h1 className="mb-3">{title}</h1>
          <p className="text-muted">{description}</p>
          <Card
            className="p-4 shadow-sm"
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
