// src/components/layouts/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col className="p-0">
          <Sidebar />
        </Col>
        <Col className="p-0" style={{ flex: '1' }}>
          <div className="p-4">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Layout;
