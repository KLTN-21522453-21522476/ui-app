import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

const SocialLogin: React.FC = () => {
  const handleSocialLogin = (provider: string) => {
    // Xử lý đăng nhập qua mạng xã hội
    console.log(`Login with ${provider}`);
  };

  return (
    <Row className="gx-2">
      <Col xs={4}>
        <Button 
          variant="outline-primary" 
          className="w-100"
          onClick={() => handleSocialLogin('facebook')}
        >
          <i className="fab fa-facebook-f"></i>
        </Button>
      </Col>
      <Col xs={4}>
        <Button 
          variant="outline-danger" 
          className="w-100"
          onClick={() => handleSocialLogin('google')}
        >
          <i className="fab fa-google"></i>
        </Button>
      </Col>
      <Col xs={4}>
        <Button 
          variant="outline-dark" 
          className="w-100"
          onClick={() => handleSocialLogin('github')}
        >
          <i className="fab fa-github"></i>
        </Button>
      </Col>
    </Row>
  );
};

export default SocialLogin;
