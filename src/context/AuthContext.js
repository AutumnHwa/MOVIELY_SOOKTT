// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => sessionStorage.getItem('authToken') || null);
  const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem('user')) || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      sessionStorage.setItem('authToken', authToken);
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
    }
  }, [authToken, user]);

  const login = (token, userInfo) => {
    setAuthToken(token);
    setUser(userInfo);
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    navigate('/log-sign');
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
