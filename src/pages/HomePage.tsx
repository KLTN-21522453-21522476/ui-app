import React, { useState } from 'react';
import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import { Facebook, Twitter, Linkedin, Instagram, Envelope } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthModal from '../components/modal/AuthModal';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login');

  const handleOpenModal = (mode: 'login' | 'register') => {
    setModalMode(mode);
    setShowModal(true);
  };
  
  return (
    <div className="home-page bg-dark text-white">
      {/* Main Content */}
      <Container fluid className="main-content py-5">
        <Row className="justify-content-start align-items-center min-vh-75">
          <Col md={7} lg={6} xl={5} className="content-wrapper ps-md-5">
            <p className="welcome-text text-uppercase mb-3">Chào mừng đến với Exlyt</p>
            <h2 className="headline mb-5">
              CHÚNG TÔI GIÚP BẠN<br />
              TRÍCH XUẤT<br />
              LƯU TRỮ<br />
              PHÂN TÍCH<br />
              VÀ LẬP RA KẾ HOẠCH KINH DOANH HIỆU QUẢ.
            </h2>
            <div className="d-flex flex-wrap gap-3">
              <Button variant="outline-light" className="text-uppercase px-4 py-3" onClick={() => handleOpenModal('login')}>
                Bắt đầu ngay
              </Button>
              <Button variant="outline-light" className="text-uppercase px-4 py-3">
                Tìm hiểu thêm
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Social Media Icons */}
      <Nav className="social-icons flex-column">
        <Nav.Link href="#" className="social-icon-link">
          <Facebook />
        </Nav.Link>
        <Nav.Link href="#" className="social-icon-link">
          <Twitter />
        </Nav.Link>
        <Nav.Link href="#" className="social-icon-link">
          <Linkedin />
        </Nav.Link>
        <Nav.Link href="#" className="social-icon-link">
          <Instagram />
        </Nav.Link>
        <Nav.Link href="#" className="social-icon-link">
          <Envelope />
        </Nav.Link>
      </Nav>

      <AuthModal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        initialMode={modalMode}
        onSuccess={() => {
          setShowModal(false);
          navigate('/groups');
        }}
      />
    </div>
  );
}

export default HomePage;
