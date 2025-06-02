import React from 'react';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useCamera } from '../../contexts/CameraContext';

interface CapturedImagesListProps {
  maxHeight?: string | number;
}

const CapturedImagesList: React.FC<CapturedImagesListProps> = ({ maxHeight = 200 }) => {
  const { capturedImages } = useCamera();
  const extractionStatus = useSelector((state: RootState) => state.extraction.loading);
  const extractedDataList = useSelector((state: RootState) => state.extraction.extractedDataList);

  if (capturedImages.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 2, maxHeight, overflowY: 'auto' }}>
      <List>
        {capturedImages.map((image) => {
          const isLoading = extractionStatus[image.id] || false;
          const hasExtractedData = extractedDataList.some(data => data.fileName === image.id);

          return (
            <ListItem
              key={image.id}
              sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 1,
                boxShadow: 1
              }}
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  src={image.dataUrl}
                  sx={{ width: 56, height: 56 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={`Hình ảnh ${new Date(image.timestamp).toLocaleTimeString()}`}
                secondary={hasExtractedData ? 'Đã trích xuất' : 'Đang xử lý...'}
                sx={{ ml: 2 }}
              />
              {isLoading && (
                <CircularProgress
                  size={24}
                  sx={{ ml: 2 }}
                />
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default CapturedImagesList; 