import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CameraComponent } from './CameraComponent';

const ResponsiveContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    padding: 0,
    maxWidth: '100% !important',
  }
}));

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  
  [theme.breakpoints.down('sm')]: {
    minHeight: '100dvh', // Use dynamic viewport height
    padding: 0,
  }
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    paddingTop: 'calc(env(safe-area-inset-top) + 8px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
  }
}));

//type OrientationLockType = 'any' | 'natural' | 'landscape' | 'portrait' | 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary';

// const supportsOrientationLock = (orientation: ScreenOrientation): orientation is ScreenOrientation & { lock: (orientation: OrientationLockType) => Promise<void> } => {
//   return 'lock' in orientation;
// };

export const CameraPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedModel, setSelectedModel] = useState('yolo8');

  // Handle viewport height for mobile browsers
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
      setTimeout(setViewportHeight, 100);
    });

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  // Prevent zoom on double tap for iOS
  useEffect(() => {
    if (isMobile) {
      const preventDefault = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };

      const preventZoom = (e: TouchEvent) => {
        const t2 = e.timeStamp;
        const t1 = (e.currentTarget as any).lastTouchEnd || t2;
        const dt = t2 - t1;
        const fingers = e.touches.length;
        (e.currentTarget as any).lastTouchEnd = t2;

        if (!dt || dt > 500 || fingers > 1) return;
        e.preventDefault();
        (e.target as HTMLElement).click();
      };

      document.addEventListener('touchstart', preventDefault, { passive: false });
      document.addEventListener('touchend', preventZoom, { passive: false });

      return () => {
        document.removeEventListener('touchstart', preventDefault);
        document.removeEventListener('touchend', preventZoom);
      };
    }
  }, [isMobile]);

  return (
    <ResponsiveContainer maxWidth={false}>
      <PageContainer>
        {!isMobile && (
          <HeaderContainer>
            <Typography 
              variant="h4" 
              component="h1" 
              align="center"
            >
              Camera
            </Typography>
          </HeaderContainer>
        )}
        
        <CameraComponent
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </PageContainer>
    </ResponsiveContainer>
  );
};

export default React.memo(CameraPage);
