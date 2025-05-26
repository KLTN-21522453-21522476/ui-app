// src/components/routes/ProtectedRoute.tsx
import React, { useState, useEffect } from 'react';
//import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/commons/Loader';
import AuthModal from '../components/modal/AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  //redirectPath = '/',
}) => {
  const { user, loading, isInitialized, checkAuth } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  //const location = useLocation();

  useEffect(() => {
    // Nếu đã khởi tạo xong và không có user, hiển thị modal đăng nhập
    if (isInitialized && !user && !loading) {
      setShowAuthModal(true);
    }
  }, [isInitialized, user, loading]);

  // Callback khi đăng nhập thành công từ modal
  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    await checkAuth(); // Kiểm tra lại trạng thái xác thực
  };

  // Hiển thị loading khi đang kiểm tra xác thực
  if (loading || !isInitialized) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      {user ? (
        // Người dùng đã đăng nhập, hiển thị nội dung bảo vệ
        <>{children}</>
      ) : (
        // Người dùng chưa đăng nhập, hiển thị modal đăng nhập
        <>
          <div className="container my-5 text-center">
            <div className="alert alert-info">
              <h4>Bạn cần đăng nhập để truy cập trang này</h4>
              <p>Vui lòng đăng nhập để tiếp tục.</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowAuthModal(true)}
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
          <AuthModal
            show={showAuthModal}
            onHide={() => setShowAuthModal(false)}
            initialMode="login"
            onSuccess={handleAuthSuccess}
          />
        </>
      )}
    </>
  );
};

export default ProtectedRoute;
