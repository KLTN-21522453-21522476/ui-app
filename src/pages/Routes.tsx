import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import Group from './Group';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/group" element={<Group />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
