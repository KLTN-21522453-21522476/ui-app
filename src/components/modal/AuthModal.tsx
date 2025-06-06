// components/modal/AuthModal.tsx
import React, { useState, FormEvent, useEffect } from 'react';
import { Modal, Form, Button, Alert, Toast, ToastContainer } from 'react-bootstrap';
import { FaGoogle, FaFacebook, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../commons/Loader';
import './AuthModal.css';

type AuthMode = 'login' | 'register';

interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterFormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface AuthModalProps {
  show: boolean;
  onHide: () => void;
  initialMode?: AuthMode;
  onSuccess?: () => void; 
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  show, 
  onHide, 
  initialMode = 'login',
  onSuccess 
}) => {
  const { login, register, loading, error, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated && onSuccess) {
      // Show success toast before redirecting
      setToastVariant('success');
      setToastMessage('Đăng nhập thành công! Đang chuyển hướng...');
      setShowToast(true);
      
      // Delay redirect to allow toast to be seen
      const timer = setTimeout(() => {
        onSuccess();
        onHide();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, onSuccess, onHide]);
  
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
    phone: '',
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
      // Toast is shown via useEffect when isAuthenticated changes
    } catch (err) {
      // Error is handled in AuthContext, but we can show a toast too
      setToastVariant('danger');
      setToastMessage('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      setShowToast(true);
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
      await register(registerForm.email, registerForm.password, registerForm.fullName, registerForm.phone);
      
      // Show success message
      setRegistrationSuccess(true);
      setToastVariant('success');
      setToastMessage('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
      setShowToast(true);
      
      // Reset register form
      setRegisterForm({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
      });
      
      // Switch to login mode after a delay
      setTimeout(() => {
        setMode('login');
        setRegistrationSuccess(false);
      }, 2000);
      
    } catch (err) {
      // Error is handled in AuthContext, but we can show a toast too
      setToastVariant('danger');
      setToastMessage('Đăng ký thất bại. Vui lòng thử lại sau.');
      setShowToast(true);
    }
  };

  // Toggle between login and register modes
  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    // Reset registration success when switching modes
    setRegistrationSuccess(false);
  };

  return (
    <>
      <Modal 
        show={show} 
        onHide={onHide} 
        centered
        size={mode === 'login' ? 'sm' : 'lg'}
        contentClassName="auth-modal bg-dark text-white border-0"
        backdropClassName="bg-dark bg-opacity-75"
      >
        <Modal.Header className="border-0 pb-0">
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            aria-label="Close" 
            onClick={onHide}
          ></button>
        </Modal.Header>
        
        <Modal.Body className="px-4 pt-0">
          {mode === 'login' ? (
            // LOGIN MODE
            <>
              <div className="text-center mb-5">
                <h3 className="fw-light m-0">Đăng nhập</h3>
                <div className="d-flex justify-content-center gap-3 mt-3">
                  <Button 
                    variant="outline-light" 
                    className="px-4 py-3 text-uppercase social-btn" 
                  >
                    <FaGoogle className="social-icon" />
                  </Button>
                  <Button 
                    variant="outline-light" 
                    className="px-4 py-3 text-uppercase social-btn"
                  >
                    <FaFacebook className="social-icon"/>
                  </Button>
                </div>
                
                <div className="d-flex align-items-center my-4">
                  <div className="flex-grow-1 border-bottom border-secondary"></div>
                  <span className="mx-3 text-secondary">Hoặc đăng nhập với email</span>
                  <div className="flex-grow-1 border-bottom border-secondary"></div>
                </div>
              </div>
              
              <Form onSubmit={handleLoginSubmit}>
                {error && <Alert variant="danger" className="bg-dark text-danger border-danger">{error}</Alert>}
                
                <Form.Group className="mb-4">
                  <Form.Control
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    placeholder="Email"
                    required
                    className="py-3 bg-dark text-white"
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
                    className="py-3 bg-dark text-white"
                  />
                  
                </Form.Group>

                <div className="d-flex justify-content-between mb-4">
                  <Form.Check
                    type="checkbox"
                    name="rememberMe"
                    checked={loginForm.rememberMe}
                    onChange={handleLoginChange}
                    label="Ghi nhớ"
                    className="text-secondary"
                  />
                  <a href="#forgot" className="text-decoration-none text-secondary">Quên mật khẩu?</a>
                </div>

                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="outline-light" 
                    disabled={loading}
                    className="px-4 py-3 text-uppercase fw-bold" 
                  >
                    {loading ? <Loader size="sm" /> : 'Đăng nhập'}
                  </Button>
                </div>
                <div className="text-center mt-4 mb-2">
                  <span className="text-secondary">Bạn chưa có tài khoản? </span>
                  <a 
                    href="/register" 
                    className="text-decoration-none text-success"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMode();
                    }}
                  >
                    Đăng ký
                  </a>
                </div>
              </Form>
            </>
          ) : (
            // REGISTER MODE
            <>
              {registrationSuccess ? (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <FaCheckCircle className="text-success" style={{ fontSize: '4rem' }} />
                  </div>
                  <h4 className="text-white mb-3">Đăng ký thành công!</h4>
                  <p className="text-secondary mb-4">
                    Tài khoản của bạn đã được tạo thành công.<br />
                    Bạn sẽ được chuyển đến trang đăng nhập trong giây lát.
                  </p>
                  <div className="d-flex justify-content-center">
                    <Loader />
                  </div>
                </div>
              ) : (
                <>
                  <div className="d-flex align-items-center mb-4">
                    <Button 
                      variant="link" 
                      className="text-white p-0 me-3"
                      onClick={toggleMode}
                    >
                      <FaArrowLeft />
                    </Button>
                    <h4 className="mb-0 text-white">Đăng ký tài khoản</h4>
                  </div>

                  <Form onSubmit={handleRegisterSubmit}>
                    {error && <Alert variant="danger" className="bg-dark text-danger border-danger">{error}</Alert>}
                    
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-4">
                          <Form.Label className="text-secondary">Họ tên</Form.Label>
                          <Form.Control
                            type="text"
                            name="fullName"
                            value={registerForm.fullName}
                            onChange={handleRegisterChange}
                            placeholder="Nhập họ tên"
                            required
                            className="py-3 bg-dark text-white"
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-4">
                          <Form.Label className="text-secondary">Số điện thoại</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={registerForm.phone}
                            onChange={handleRegisterChange}
                            placeholder="Nhập số điện thoại"
                            className="py-3 bg-dark text-white"
                          />
                        </Form.Group>
                      </div>
                    </div>
                    
                    <Form.Group className="mb-4">
                      <Form.Label className="text-secondary">Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                        placeholder="Nhập địa chỉ email"
                        required
                        className="py-3 bg-dark text-white"
                      />
                    </Form.Group>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-4">
                          <Form.Label className="text-secondary">Mật khẩu</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={registerForm.password}
                            onChange={handleRegisterChange}
                            placeholder="Nhập mật khẩu"
                            isInvalid={!!validationErrors.password}
                            required
                            className="py-3 bg-dark text-white"
                          />
                          <Form.Control.Feedback type="invalid" className="text-danger">
                            {validationErrors.password}
                          </Form.Control.Feedback>
                          <Form.Text className="text-secondary small">
                            Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
                          </Form.Text>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-4">
                          <Form.Label className="text-secondary">Xác nhận mật khẩu</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={registerForm.confirmPassword}
                            onChange={handleRegisterChange}
                            placeholder="Xác nhận mật khẩu"
                            isInvalid={!!validationErrors.confirmPassword}
                            required
                            className="py-3 bg-dark text-white"
                          />
                          <Form.Control.Feedback type="invalid" className="text-danger">
                            {validationErrors.confirmPassword}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </div>
                    
                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        name="agreeTerms"
                        checked={registerForm.agreeTerms}
                        onChange={handleRegisterChange}
                        className="text-secondary"
                        label={
                          <span>
                            Tôi đồng ý với <a href="/terms" className="text-success">Điều khoản</a> và <a href="/privacy" className="text-success">Quyền riêng tư</a>
                          </span>
                        }
                        required
                        feedback="You must agree to the terms to continue."
                        feedbackType="invalid"
                      />
                    </Form.Group>
                    
                    <div className="d-grid mt-4">
                      <Button 
                        type="submit" 
                        variant="outline-light" 
                        disabled={loading || !registerForm.agreeTerms}
                        className="px-4 py-3 text-uppercase fw-bold"
                      >
                        {loading ? <Loader size="sm" /> : 'Tạo tài khoản'}
                      </Button>
                    </div>
                    
                    <div className="text-center mt-4 mb-2">
                      <div className="d-flex align-items-center my-4">
                        <div className="flex-grow-1 border-bottom border-secondary"></div>
                        <span className="mx-3 text-secondary">hoặc đăng ký với</span>
                        <div className="flex-grow-1 border-bottom border-secondary"></div>
                      </div>
                      <div className="d-flex justify-content-center gap-3">
                        <Button 
                          variant="outline-light" 
                          className="px-4 py-3 text-uppercase"
                        >
                          <FaGoogle />
                        </Button>
                        <Button 
                          variant="outline-light" 
                          className="px-4 py-3 text-uppercase"
                        >
                          <FaFacebook />
                        </Button>
                      </div>
                    </div>
                  </Form>
                </>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1100 }}>
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide 
          bg={toastVariant}
          className="text-white"
        >
          <Toast.Header closeButton={false} className={`bg-${toastVariant} text-white`}>
            <strong className="me-auto">
              {toastVariant === 'success' ? 'Thành công' : 'Lỗi'}
            </strong>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={() => setShowToast(false)}
            ></button>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default AuthModal;
