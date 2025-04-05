import React from 'react';
import { Button as BootstrapButton, ButtonProps as BsButtonProps, Spinner } from 'react-bootstrap';

interface ButtonProps extends BsButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  loading, 
  disabled, 
  icon,
  className = '',
  ...props 
}) => {
  return (
    <BootstrapButton
      disabled={disabled || loading}
      className={`d-flex align-items-center justify-content-center ${className}`}
      {...props}
    >
      {loading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        />
      )}
      {!loading && icon && <span className="me-2">{icon}</span>}
      {children}
    </BootstrapButton>
  );
};

export default Button;
