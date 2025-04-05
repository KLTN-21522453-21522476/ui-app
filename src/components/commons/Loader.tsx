import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: string;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  variant = 'primary',
  text
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return { width: '1rem', height: '1rem' };
      case 'lg': return { width: '3rem', height: '3rem' };
      default: return { width: '2rem', height: '2rem' };
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <Spinner
        animation="border"
        variant={variant}
        role="status"
        style={getSize()}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      {text && <span className="ms-2">{text}</span>}
    </div>
  );
};

export default Loader;
