import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';

/**
 * ProtectedRoute: Guards routes based on authentication and group selection.
 * - If not authenticated, redirect to home page ('/').
 * - If authenticated but no group selected, only allow /groups, otherwise redirect to /groups.
 * - If authenticated and group selected, allow access.
 */
const ProtectedRoute: React.FC<{ children: React.ReactElement, requireGroup?: boolean }> = ({ children, requireGroup = false }) => {
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);
  const selectedGroupId = useAppSelector((state) => state.groups.selectedGroupId);
  const location = useLocation();

  if (!isInitialized) {
    // Optionally show a loading spinner
    return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>Đang kiểm tra phiên đăng nhập...</div>;
  }

  if (!isAuthenticated) {
    // Not logged in: redirect to home
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requireGroup && !selectedGroupId) {
    // Logged in but no group selected: only allow /groups
    return <Navigate to="/groups" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
