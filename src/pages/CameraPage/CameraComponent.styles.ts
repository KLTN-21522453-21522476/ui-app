import { styled } from '@mui/material/styles';
import { Box, IconButton, Paper } from '@mui/material';

export const CameraContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',

  [theme.breakpoints.down('sm')]: {
    height: '100dvh', // Use dynamic viewport height for mobile
  }
}));

export const VideoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[900],
  overflow: 'hidden',
  
  [theme.breakpoints.down('sm')]: {
    width: '100vw',
    marginLeft: 'calc(-50vw + 50%)',
  }
}));

export const VideoPreview = styled('video')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  backgroundColor: theme.palette.grey[900],
  transition: 'transform 0.3s ease-in-out',

  '&.landscape': {
    transform: 'rotate(90deg)',
    width: '100vh',
    height: '100vw',
  },

  [theme.breakpoints.down('sm')]: {
    width: '100vw',
    height: '100%',
    
    '&.landscape': {
      transform: 'rotate(90deg)',
      width: '100vh',
      height: '100vw',
    }
  }
}));

export const ControlsContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: 0,
  zIndex: 10,
  minHeight: 80,
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 1),
    minHeight: 70,
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)', // Handle safe area
  }
}));

export const ControlButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(5px)',
  padding: theme.spacing(1.5),
  margin: theme.spacing(0, 0.5),
  minWidth: 48,
  minHeight: 48,
  border: '1px solid rgba(255, 255, 255, 0.2)',
  
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  '&.active': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: `1px solid ${theme.palette.primary.main}`,
  },

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    margin: theme.spacing(0, 0.25),
    minWidth: 44,
    minHeight: 44,
    
    '& .MuiSvgIcon-root': {
      fontSize: '1.2rem',
    }
  }
}));

export const CaptureButton = styled(IconButton)(({ theme }) => ({
  width: 72,
  height: 72,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  border: '3px solid rgba(255, 255, 255, 0.3)',
  
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.05)',
  },

  '&:disabled': {
    backgroundColor: theme.palette.grey[500],
  },

  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
  },

  [theme.breakpoints.down('sm')]: {
    width: 64,
    height: 64,
    
    '& .MuiSvgIcon-root': {
      fontSize: '1.8rem',
    }
  }
}));

export const DeviceSelectionContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  width: 'calc(100% - 32px)',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 20,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    margin: theme.spacing(1),
    width: 'calc(100% - 16px)',
    borderRadius: theme.spacing(1),
  }
}));

export const ModelSelectionContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(10px)',
  zIndex: 15,
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 1),
    paddingTop: 'calc(env(safe-area-inset-top) + 12px)', // Handle safe area
  }
}));

export const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  zIndex: 100,
  
  '& .MuiCircularProgress-root': {
    color: theme.palette.primary.main,
  }
}));

export const StatusIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  padding: theme.spacing(0.5, 1),
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: theme.palette.common.white,
  borderRadius: theme.spacing(2),
  fontSize: '0.75rem',
  zIndex: 10,
  
  [theme.breakpoints.down('sm')]: {
    top: 'calc(env(safe-area-inset-top) + 8px)',
    right: theme.spacing(1),
    fontSize: '0.7rem',
  }
}));
