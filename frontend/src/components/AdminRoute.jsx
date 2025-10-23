import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user } = useAuth();
  
  // Must be logged in AND have the 'admin' role
  if (user && user.role === 'admin') {
    return <Outlet />;
  }

  // Redirect to home if not an admin
  return <Navigate to="/" replace />;
};

export default AdminRoute;