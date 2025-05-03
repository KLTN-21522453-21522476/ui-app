import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { FaSearch, FaEnvelope, FaBell } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import LoginModal from '../modal/AuthModal';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="border-bottom shadow-sm py-2">
        <Container fluid className="px-4">
          <div className="d-flex align-items-center w-100 justify-content-between">
            {/* Search Box - Left Side */}
            <div className="position-relative" style={{ maxWidth: '260px', width: '100%' }}>
              <InputGroup className="border rounded-pill bg-light overflow-hidden">
                <div className="input-group-prepend d-flex align-items-center ps-3">
                  <FaSearch className="text-muted" size={14} />
                </div>
                <Form.Control
                  type="search"
                  placeholder="Search ..."
                  aria-label="Search"
                  className="border-0 bg-light py-2 ps-2"
                  style={{ boxShadow: 'none' }}
                />
              </InputGroup>
            </div>

            {/* Right Side Icons and User */}
            <div className="d-flex align-items-center">
              {/* Mail Icon */}
              <Nav.Link className="me-3 position-relative">
                <FaEnvelope className="text-muted" size={18} />
              </Nav.Link>

              {/* Notification Icon with Badge */}
              <Nav.Link className="me-3 position-relative">
                <FaBell className="text-muted" size={18} />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success" 
                      style={{ fontSize: '0.6rem', transform: 'translate(-50%, -30%)' }}>
                  4
                </span>
              </Nav.Link>

              {/* User Profile or Login Link */}
              {user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle as="div" className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                    <div className="fw-medium" style={{ fontSize: '14px' }}>Hi, {user.name}</div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-end shadow-sm mt-2">
                    <Dropdown.Item href="/profile">Tài khoản</Dropdown.Item>
                    <Dropdown.Item href="/settings">Cài đặt</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout}>Đăng xuất</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div 
                  onClick={handleLoginClick} 
                  className="d-flex align-items-center" 
                  style={{ cursor: 'pointer' }}
                >
                  <div className="fw-medium" style={{ fontSize: '14px' }}>Đăng nhập</div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Login Modal */}
      <LoginModal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default Header;
