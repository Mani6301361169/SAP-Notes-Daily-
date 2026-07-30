import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sap_token') || sessionStorage.getItem('sap_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('sap_token') || sessionStorage.getItem('sap_token');
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        setToken(storedToken);
      } catch (err) {
        console.warn('Token expired or invalid', err);
        localStorage.removeItem('sap_token');
        sessionStorage.removeItem('sap_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password, rememberMe = false) => {
    const res = await api.post('/auth/login', { email, password, rememberMe });
    const { token: newToken, user: userData } = res.data;
    
    if (rememberMe) {
      localStorage.setItem('sap_token', newToken);
    } else {
      sessionStorage.setItem('sap_token', newToken);
    }
    
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const register = async (name, email, password, role = 'user') => {
    const res = await api.post('/auth/register', { name, email, password, role });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('sap_token', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('sap_token');
    sessionStorage.removeItem('sap_token');
    setToken(null);
    setUser(null);
  };

  // Quick Role Switcher for testing Admin vs Learner User in active session
  const quickSwitchRole = async (targetRole) => {
    const email = targetRole === 'admin' ? 'admin@sap.com' : 'user@sap.com';
    const password = targetRole === 'admin' ? 'Admin@123' : 'User@123';
    try {
      await login(email, password, true);
    } catch (e) {
      if (user) {
        setUser(prev => ({
          ...prev,
          role: targetRole,
          name: targetRole === 'admin' ? 'SAP System Admin' : 'SAP Learner User',
          email
        }));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, quickSwitchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
