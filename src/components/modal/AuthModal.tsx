// components/modal/AuthModal.tsx
import React, { useState, FormEvent } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import CustomButton from '../commons/Button';
import Loader from '../commons/Loader';
import Logo from '../commons/Logo';
//import SocialLogin from '../layouts/SocialLogin';

type AuthMode = 'login' | 'register';

interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterFormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface AuthModalProps {
  show: boolean;
  onHide: () => void;
  initialMode?: AuthMode;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  show, 
  onHide, 
  initialMode = 'login' 
}) => {
  const { login, register, loading, error } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  
  // Login form state
  const [loginForm, setLoginForm] = useState<LoginFormState>({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState<RegisterFormState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  // Validation errors for register form
  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  // Handle login form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle register form changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm(prev => ({
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

  // Validate register form
  const validateRegisterForm = (): boolean => {
    const errors: {
      password?: string;
      confirmPassword?: string;
    } = {};
    
    // Validate password strength
    if (registerForm.password.length < 8) {
      errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerForm.password)) {
      errors.password = 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số';
    }
    
    // Validate password confirmation
    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setValidationErrors(errors);
    
    // Return true if no errors
    return Object.keys(errors).length === 0;
  };

  // Handle login form submission
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await login(loginForm.email, loginForm.password, loginForm.rememberMe);
      onHide(); // Close modal after successful login
    } catch (err) {
      // Error is handled in AuthContext
    }
  };

  // Handle register form submission
  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateRegisterForm()) {
      return;
    }
    
    try {
      await register(registerForm.email, registerForm.password, registerForm.fullName);
      // Switch to login mode after successful registration
      setMode('login');
      // Reset register form
      setRegisterForm({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
      });
    } catch (err) {
      // Error is handled in AuthContext
    }
  };

  // Toggle between login and register modes
  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered
      size={mode === 'login' ? 'sm' : 'lg'}
      contentClassName="rounded-4 border-0"
    >
      <Modal.Header className="border-0 pb-0">
        <button 
          type="button" 
          className="btn-close" 
          aria-label="Close" 
          onClick={onHide}
        ></button>
      </Modal.Header>
      
      <Modal.Body className="px-4 pt-0">
        {mode === 'login' ? (
          // LOGIN MODE
          <>
            <div className="text-center mb-4">
              <h5 className="fw-normal">Đăng nhập với</h5>
              
              <div className="d-flex justify-content-center gap-3 mt-3">
                <Button 
                  variant="outline-secondary" 
                  className="rounded-circle p-2" 
                  style={{ width: '40px', height: '40px' }}
                >
                  <FaGoogle />
                </Button>
                <Button 
                  variant="outline-secondary" 
                  className="rounded-circle p-2" 
                  style={{ width: '40px', height: '40px' }}
                >
                  <FaFacebook />
                </Button>
              </div>
              
              <div className="d-flex align-items-center my-3">
                <div className="flex-grow-1 border-bottom"></div>
                <span className="mx-2 text-muted">hoặc</span>
                <div className="flex-grow-1 border-bottom"></div>
              </div>
            </div>
            
            <Form onSubmit={handleLoginSubmit}>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="Email"
                  required
                  className="py-2"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Control
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Mật khẩu"
                  required
                  className="py-2"
                />

              </Form.Group>

                            <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  name="rememberMe"
                  checked={loginForm.rememberMe}
                  onChange={handleLoginChange}
                  label="Ghi nhớ đăng nhập"
                />
              </Form.Group>

              <div className="d-grid">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                  className="py-2 text-uppercase fw-bold"
                >
                  {loading ? <Loader size="sm" /> : 'Đăng nhập'}
                </Button>
              </div>
              
              <div className="text-center mt-3 mb-2">
                <a 
                  href="/register" 
                  className="text-decoration-none"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMode();
                    
                  }}
                >
                  Chưa có tài khoản? Đăng ký
                </a>
              </div>
            </Form>
          </>
        ) : (
          // REGISTER MODE
          <>
            <div className="text-center mb-3">
              <Logo />
              <h4 className="fw-normal mt-2">Đăng ký tài khoản</h4>
              
              <div className="d-flex align-items-center my-3">
                <div className="flex-grow-1 border-bottom"></div>
                <span className="mx-2 text-muted">hoặc đăng ký với</span>
                <div className="flex-grow-1 border-bottom"></div>
              </div>
              
              <div className="d-flex justify-content-center gap-3 mt-2 mb-4">
                <Button 
                  variant="outline-secondary" 
                  className="rounded-circle p-2" 
                  style={{ width: '40px', height: '40px' }}
                >
                  <FaGoogle />
                </Button>
                <Button 
                  variant="outline-secondary" 
                  className="rounded-circle p-2" 
                  style={{ width: '40px', height: '40px' }}
                >
                  <FaFacebook />
                </Button>
              </div>
            </div>
            
            <Form onSubmit={handleRegisterSubmit}>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form.Group className="mb-3">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={registerForm.fullName}
                  onChange={handleRegisterChange}
                  placeholder="Nhập họ và tên của bạn"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
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
                  value={registerForm.password}
                  onChange={handleRegisterChange}
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
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
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
                  checked={registerForm.agreeTerms}
                  onChange={handleRegisterChange}
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
                  variant="primary" 
                  disabled={loading || !registerForm.agreeTerms}
                  className="py-2 text-uppercase fw-bold"
                >
                  {loading ? <Loader size="sm" /> : 'ĐĂNG KÝ'}
                </CustomButton>
              </div>
              
              <div className="text-center mt-3 mb-2">
                <a 
                  href="#login" 
                  className="text-decoration-none"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMode();
                  }}
                >
                  Đã có tài khoản? Đăng nhập ngay!
                </a>
              </div>
            </Form>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
