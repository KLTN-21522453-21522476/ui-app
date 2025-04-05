import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';
import CustomButton from '../commons/Button';
import Loader from '../commons/Loader';
import SocialLogin from '../layouts/SocialLogin';
import Logo from '../commons/Logo';
import { useAuth } from '../../hooks/authService';

interface RegisterFormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  
  const [formData, setFormData] = useState<RegisterFormState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation errors when user types
    if (name === 'password' || name === 'confirmPassword') {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: {
      password?: string;
      confirmPassword?: string;
    } = {};
    
    // Validate password strength
    if (formData.password.length < 8) {
      errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số';
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setValidationErrors(errors);
    
    // Return true if no errors
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    try {
      // Call the register function from AuthContext
      await register(formData.email, formData.password, formData.fullName);
      
      // If registration is successful, redirect to login page
      navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
    } catch (err) {
      // Error handling is managed in the AuthContext
    }
  };

  return (
    <Container fluid className="register-page d-flex align-items-center justify-content-center">
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="shadow-lg border-0 rounded-lg mt-5 mb-5">
            <Card.Header className="bg-dark text-white text-center py-4">
              <Logo />
              <h3 className="font-weight-light my-2">Đăng ký tài khoản</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                </Form.Group>

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
                  <Form.Text className="text-muted">
                    Email này sẽ được sử dụng để đăng nhập và nhận thông báo.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tạo mật khẩu mới"
                    isInvalid={!!validationErrors.password}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.password}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Xác nhận mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    isInvalid={!!validationErrors.confirmPassword}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    label={
                      <span>
                        Tôi đồng ý với <a href="/terms" target="_blank">Điều khoản sử dụng</a> và <a href="/privacy" target="_blank">Chính sách bảo mật</a>
                      </span>
                    }
                    required
                    feedback="Bạn phải đồng ý với điều khoản để tiếp tục."
                    feedbackType="invalid"
                  />
                </Form.Group>

                <div className="d-grid gap-2 mt-4">
                  <CustomButton 
                    type="submit" 
                    variant="dark" 
                    disabled={loading || !formData.agreeTerms}
                    className="btn-lg"
                  >
                    {loading ? <Loader size="sm" /> : 'Đăng ký'}
                  </CustomButton>
                </div>
              </Form>

              <div className="text-center mt-3">
                <hr className="my-4" />
                <p className="text-muted">Hoặc đăng ký với</p>
                <SocialLogin />
              </div>
            </Card.Body>
            <Card.Footer className="text-center py-3">
              <div className="small">
                <a href="/login">Đã có tài khoản? Đăng nhập ngay!</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
