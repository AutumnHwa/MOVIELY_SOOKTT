import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element }) => {
  const { authToken } = useAuth();

  if (!authToken) {
    return <Navigate to="/log-sign" />;
  }

  return element;
};

export default ProtectedRoute;
