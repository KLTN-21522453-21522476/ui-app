import React from 'react';
import { Spinner } from 'react-bootstrap';
import { FilePreviewProps } from '../../../types/FileList';
import { Dialog, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const FilePreview: React.FC<FilePreviewProps> = ({ file, width = "120px", height = "120px" }) => {
  const [openImageModal, setOpenImageModal] = React.useState(false);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenImageModal(true);
  };

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
          opacity: file.status === 'loading' ? 0.5 : 1,
          cursor: 'pointer'
        }}
        className="img-fluid"
        onClick={handleImageClick}
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

      {/* Image Modal */}
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
        <Box position="relative" bgcolor="#000" display="flex" justifyContent="center" alignItems="center" onClick={(e) => {
          if (e && typeof (e as any).stopPropagation === 'function') {
            (e as React.MouseEvent).stopPropagation();
          }
        }}>
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
          <img
            src={file.preview}
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
          />
        </Box>
      </Dialog>
    </div>
  );
};

export default FilePreview;
