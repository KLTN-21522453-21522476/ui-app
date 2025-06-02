import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CapturedImage {
  id: string;
  dataUrl: string;
  file: File;
  timestamp: number;
}

interface CameraContextType {
  capturedImages: CapturedImage[];
  addCapturedImage: (dataUrl: string, file: File) => void;
  removeCapturedImage: (id: string) => void;
  clearCapturedImages: () => void;
  getCapturedImage: (id: string) => CapturedImage | undefined;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);

  const addCapturedImage = (dataUrl: string, file: File) => {
    const newImage: CapturedImage = {
      id: `camera_${Date.now()}`,
      dataUrl,
      file,
      timestamp: Date.now()
    };
    setCapturedImages(prev => [...prev, newImage]);
  };

  const removeCapturedImage = (id: string) => {
    setCapturedImages(prev => prev.filter(img => img.id !== id));
  };

  const clearCapturedImages = () => {
    setCapturedImages([]);
  };

  const getCapturedImage = (id: string) => {
    return capturedImages.find(img => img.id === id);
  };

  return (
    <CameraContext.Provider value={{
      capturedImages,
      addCapturedImage,
      removeCapturedImage,
      clearCapturedImages,
      getCapturedImage
    }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
}; 