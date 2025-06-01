import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Dialog, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FilePreview as FilePreviewType } from '../../../redux/slices/fileUploadSlice';

interface FilePreviewProps {
  file: FilePreviewType;
  width?: string;
  height?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, width = "120px", height = "120px" }) => {
  const [openImageModal, setOpenImageModal] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenImageModal(true);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  // Get the image URL - could be a preview (local) or a remote URL
  const imageUrl = file.url || file.preview;

  return (
    <div className="position-relative">
      <img
        src={imageUrl}
        alt={file.name}
        style={{
          width: width,
          height: height,
          objectFit: "cover",
          borderRadius: "4px",
          opacity: (file.status === 'loading' || isLoading) ? 0.5 : 1,
          cursor: 'pointer',
          display: imageError ? 'none' : 'block'
        }}
        className="img-fluid"
        onClick={handleImageClick}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {imageError && (
        <div 
          className="position-absolute d-flex justify-content-center align-items-center"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#f8f9fa',
            borderRadius: "4px",
            border: '1px solid #dee2e6'
          }}
        >
          <span className="text-muted small">Không thể tải hình ảnh</span>
        </div>
      )}

      {(isLoading || file.status === 'loading') && (
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

      {file.status === 'error' && !imageError && (
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

      <Dialog 
        open={openImageModal} 
        onClose={(e) => {
          if (e && typeof (e as any).stopPropagation === 'function') {
            (e as React.MouseEvent).stopPropagation();
          }
          setOpenImageModal(false);
        }}
        maxWidth="md"
        fullWidth
        onClick={(e) => {
          if (e && typeof (e as any).stopPropagation === 'function') {
            (e as React.MouseEvent).stopPropagation();
          }
        }}
      >
        <Box 
          position="relative" 
          bgcolor="#000" 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="50vh"
          onClick={(e) => {
            if (e && typeof (e as any).stopPropagation === 'function') {
              (e as React.MouseEvent).stopPropagation();
            }
          }}
        >
          <IconButton
            onClick={(e) => {
              if (e && typeof (e as any).stopPropagation === 'function') {
                (e as React.MouseEvent).stopPropagation();
              }
              setOpenImageModal(false);
            }}
            sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', zIndex: 2 }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          {!imageError ? (
            <img
              src={imageUrl}
              alt={file.name}
              style={{ 
                width: '100%', 
                maxWidth: 700, 
                maxHeight: '80vh', 
                objectFit: 'contain', 
                display: 'block', 
                margin: '0 auto', 
                background: '#000' 
              }}
              onError={handleImageError}
            />
          ) : (
            <div className="text-white p-4 text-center">
              <p>Không thể tải hình ảnh</p>
              <small className="d-block text-muted">URL: {imageUrl}</small>
            </div>
          )}
        </Box>
      </Dialog>
    </div>
  );
};

export default FilePreview;
