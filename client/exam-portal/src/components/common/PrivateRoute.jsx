import React from 'react';
import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);

  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  try {
    // Depending on your import style, you might need to use jwtDecode.default
    const decoded = jwt_decode(token);
    console.log('Decoded token:', decoded);
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      console.log('Token expired, redirecting to login');
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
