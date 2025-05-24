import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import UploadInvoicePage from './UploadInvoicePage';
import Dashboard from './Dashboard';
import Group  from './Group';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/upload-invoice" element={<UploadInvoicePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/groups" element={<Group />} />
      
      {/* Catch-all route: redirect to homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default AppRoutes;
