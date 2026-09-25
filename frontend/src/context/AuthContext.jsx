import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('disha_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('disha_token', data.token);
      localStorage.setItem('disha_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('disha_token', data.token);
      localStorage.setItem('disha_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('disha_token');
    localStorage.removeItem('disha_user');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await api.get('/users/profile');
    localStorage.setItem('disha_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
