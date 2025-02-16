import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateVolunteerRoute = () => {
  const userRole = sessionStorage.getItem('userRole') || Cookies.get('userRole');
  const isAuthenticated = userRole === 'Volunteer' || userRole === 'Admin';

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateVolunteerRoute;
