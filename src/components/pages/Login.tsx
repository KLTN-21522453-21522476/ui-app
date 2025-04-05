import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';
import CustomButton from '../commons/Button';
import Loader from '../commons/Loader';
import SocialLogin from '../layouts/SocialLogin';
import Logo from '../commons/Logo';
import { useAuth } from '../../hooks/authService';

interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormState>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      // Call the login function from AuthContext
      await login(formData.email, formData.password);
      
      // If login is successful, redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Error handling is managed in the AuthContext
    }
  };

  return (
    <Container fluid className="login-page d-flex align-items-center justify-content-center">
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <Card className="shadow-lg border-0 rounded-lg mt-5">
            <Card.Header className="bg-dark text-white text-center py-4">
              <Logo />
              <h3 className="font-weight-light my-2">Đăng nhập</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email của bạn"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    label="Ghi nhớ đăng nhập"
                  />
                </Form.Group>

                <div className="d-grid gap-2 mt-4">
                  <CustomButton 
                    type="submit" 
                    variant="dark" 
                    disabled={loading}
                    className="btn-lg"
                  >
                    {loading ? <Loader size="sm" /> : 'Đăng nhập'}
                  </CustomButton>
                </div>
              </Form>

              <div className="text-center mt-3">
                <hr className="my-4" />
                <p className="text-muted">Hoặc đăng nhập với</p>
                <SocialLogin />
              </div>
            </Card.Body>
            <Card.Footer className="text-center py-3">
              <div className="small">
                <a href="/register">Chưa có tài khoản? Đăng ký ngay!</a>
              </div>
              <div className="small mt-2">
                <a href="/forgot-password">Quên mật khẩu?</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
