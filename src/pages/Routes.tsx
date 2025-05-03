import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
