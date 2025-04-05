import React from "react";
import { Card, ListGroup, Button } from "react-bootstrap";
import { UploadedFile } from "../types/UploadeFile";

interface FileListProps {
  files: UploadedFile[];
  onRemoveFile: (fileName: string) => void;
  onClearAll: () => void;
}

const FileList: React.FC<FileListProps> = ({
  files,
  onRemoveFile,
  onClearAll,
}) => {
  return (
    <Card className="mt-4 p-3 shadow-sm">
      <ListGroup variant="flush">
        {files.map((file, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center">
              <img
                src={file.preview}
                alt={file.name}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  marginRight: "10px",
                }}
              />
              <div>
                <p className="mb-0">{file.name}</p>
                <small className="text-muted">{file.size} kB</small>
              </div>
            </div>
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => onRemoveFile(file.name)}
            >
              Xoá
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className="d-flex justify-content-between mt-3">
        <Button variant="outline-secondary" onClick={onClearAll}>
          Xoá hết
        </Button>
        <Button variant="dark">Trích xuất</Button>
      </div>
    </Card>
  );
};

export default FileList;
