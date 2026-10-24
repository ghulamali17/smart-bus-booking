import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiRegister, apiGetMe } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('smartbus_token') || null);
  const [loading, setLoading] = useState(true);

  // Check /me on initial mount if token exists
  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem('smartbus_token');
      if (storedToken) {
        try {
          const profile = await apiGetMe();
          setUser(profile);
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          localStorage.removeItem('smartbus_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    localStorage.setItem('smartbus_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (name, email, password, role = 'user') => {
    const res = await apiRegister(name, email, password, role);
    localStorage.setItem('smartbus_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('smartbus_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
