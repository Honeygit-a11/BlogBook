import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  // Initialize state based on the token in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  // Optional: Add a side effect to update state when localStorage changes 
  // (e.g., if a token is set in a separate login component)
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []); // Only runs on mount

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    // You might also want to clear other user data here
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};