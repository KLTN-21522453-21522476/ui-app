import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import AuthModal from '../modal/AuthModal';

const Header: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login');

  const handleOpenModal = (mode: 'login' | 'register') => {
    setModalMode(mode);
    setShowModal(true);
  };

  return (
    <header className="d-flex justify-content-between align-items-center px-4 py-3 bg-dark text-white">
      <div className="logo">
        <h1 className="mb-0">Exlyt.</h1>
      </div>
      <div>
        <Button 
          variant="outline-light" 
          className="me-2"
          onClick={() => handleOpenModal('login')}
        >
          Đăng nhập
        </Button>
        <Button 
          variant="outline-light" 
          className="me-2"
          onClick={() => handleOpenModal('register')}
        >
          Đăng ký
        </Button>
      </div>
      <AuthModal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        initialMode={modalMode}
      />
    </header>
  );
};

export default Header;
