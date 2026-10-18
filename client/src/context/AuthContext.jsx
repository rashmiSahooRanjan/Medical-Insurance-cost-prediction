import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('arogya_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('arogya_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('arogya_user');
      }
    }
    setLoading(false);
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('arogya_user', JSON.stringify(userData));
    localStorage.setItem('arogya_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('arogya_user');
    localStorage.removeItem('arogya_token');
  };

  const demoLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@arogyakavaj.com', password: 'demo123' }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.user, data.token);
        return { success: true };
      }
    } catch (err) {
      // Offline demo fallback
      const demoUser = {
        id: 'usr_demo',
        name: 'Rahul Sharma',
        email: 'demo@arogyakavaj.com',
        phone: '+91 98765 43210',
        age: 32,
        gender: 'Male',
        city: 'Mumbai',
      };
      login(demoUser, 'demo_token_123');
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, demoLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
