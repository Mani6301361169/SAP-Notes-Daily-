import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sap_token') || sessionStorage.getItem('sap_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        // Pre-set default guest/user state for immediate exploration if not logged in
        setUser({
          id: 'demo-user-id',
          name: 'SAP Learner User',
          email: 'user@sap.com',
          role: 'user',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        });
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.warn('Token expired or invalid', err);
        localStorage.removeItem('sap_token');
        sessionStorage.removeItem('sap_token');
        setToken(null);
        // Default to learner view
        setUser({
          id: 'demo-user-id',
          name: 'SAP Learner User',
          email: 'user@sap.com',
          role: 'user',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        });
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
    setUser({
      id: 'demo-user-id',
      name: 'SAP Learner User',
      email: 'user@sap.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });
  };

  // Quick Role Toggle for testing Admin vs User UI
  const quickSwitchRole = async (targetRole) => {
    const email = targetRole === 'admin' ? 'admin@sap.com' : 'user@sap.com';
    const password = targetRole === 'admin' ? 'Admin@123' : 'User@123';
    try {
      await login(email, password, false);
    } catch (e) {
      // Fallback local switch
      setUser(prev => ({
        ...prev,
        role: targetRole,
        name: targetRole === 'admin' ? 'SAP System Admin' : 'SAP Learner User',
        email
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, quickSwitchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
