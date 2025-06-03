import React, { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { CameraComponent } from './CameraComponent';

export const CameraPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('yolo8');

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Camera
        </Typography>
        
        <CameraComponent
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </Box>
    </Container>
  );
};

export default React.memo(CameraPage);
