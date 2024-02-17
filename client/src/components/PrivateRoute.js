// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const CustomPrivateRoute = ({ element: Element, requiredRole, ...rest }) => {
  const isAuthenticated = localStorage.getItem('token');
  const userRole = JSON.parse(localStorage.getItem('user')).role;
  const isAuthorized = isAuthenticated && userRole === requiredRole;

  return isAuthorized ? <Route {...rest} element={<Element />} /> : <Navigate to="/login" />;
};

export default CustomPrivateRoute;
