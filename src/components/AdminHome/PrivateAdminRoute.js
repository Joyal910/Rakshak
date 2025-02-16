import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateAdminRoute = () => {
  const userRole = sessionStorage.getItem('userRole') || Cookies.get('userRole');
  const isAuthenticated = userRole === 'Admin';

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateAdminRoute;