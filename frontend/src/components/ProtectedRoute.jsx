import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();
  
  // You can also check for user loading state here
  if (!user) {
    // Redirect them to the /login page, but save the current location
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Render the child route (e.g., CreateItemPage)
};

export default ProtectedRoute;