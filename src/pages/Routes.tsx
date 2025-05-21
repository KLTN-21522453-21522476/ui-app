import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import GroupDashboard from './GroupDashboard';
import Group  from './Group';
import ProtectedRoute from '../components/ProtectedRoute'
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route 
            path="/groups" 
            element={
              <ProtectedRoute>
                <Group  />
              </ProtectedRoute>
            } 
          />

      <Route 
            path="groups/:groupId" 
            element={
              <ProtectedRoute>
                <GroupDashboard  />
              </ProtectedRoute>
            } 
          />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
