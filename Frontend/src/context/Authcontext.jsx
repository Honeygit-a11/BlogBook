import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  authReady: false,
  login: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const hydrateAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setAuthReady(true);
        return;
      }

      setIsAuthenticated(true);

      if (userData) {
        try {
          setUser(JSON.parse(userData));
          setAuthReady(true);
          return;
        } catch {
          localStorage.removeItem('user');
        }
      }

      try {
        const response = await fetch('http://localhost:4000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setAuthReady(true);
      }
    };

    hydrateAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setAuthReady(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setAuthReady(true);
    navigate('/');
    // You might also want to clear other user data here
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, authReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
