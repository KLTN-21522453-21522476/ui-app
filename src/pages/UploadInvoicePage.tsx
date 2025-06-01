import React from "react";
import { useSelector } from 'react-redux';
import FileList from "../components/layouts/upload/FileList";
import FileUploadComponent from "../components/layouts/upload/FileUploadComponent";
import { RootState } from "../redux/store";

const InvoiceExtraction: React.FC = () => {
  const files = useSelector((state: RootState) => state.fileUpload.files);

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center py-4 px-3 px-sm-4">
      <div className="w-100" style={{ maxWidth: '1200px' }}>
        <FileUploadComponent
          title="Trích xuất dữ liệu"
          description="Sử dụng mô hình YOLO tiên tiến và OCR mạnh mẽ để trích xuất dữ liệu từ hoá đơn của bạn một cách nhanh chóng"
          fileListComponent={
            files.length > 0 ? (
              <div className="mt-4">
                <FileList />
              </div>
            ) : null
          }
        />
      </div>
    </div>
  );
};

export default InvoiceExtraction;