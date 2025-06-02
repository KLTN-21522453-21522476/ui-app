import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import UploadInvoicePage from './UploadInvoicePage';
import ExtractedDataPage from './ExtractedDataPage';
import Dashboard from './Dashboard';
import Group  from './Group';
import ProtectedRoute from '../components/routes/ProtectedRoute';
import { CameraPage } from './CameraPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Only allow access to /groups if authenticated but no group selected */}
      <Route path="/groups" element={
        <ProtectedRoute>
          <Group />
        </ProtectedRoute>
      } />
      {/* All other routes require authentication AND group selection */}
      <Route path="/upload-invoice" element={
        <ProtectedRoute requireGroup>
          <UploadInvoicePage />
        </ProtectedRoute>
      } />
      <Route path="/extracted-data" element={
        <ProtectedRoute requireGroup>
          <ExtractedDataPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute requireGroup>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/invoice-capture" element={
        <ProtectedRoute requireGroup>
          <CameraPage />
        </ProtectedRoute>
      } />
      {/* Catch-all route: redirect to homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default AppRoutes;
