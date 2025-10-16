// src/App.js (Revised)

import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Signup from './components/Signup';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Needs to be updated
import { AuthProvider, AuthContext } from './context/Authcontext'; // NEW
import "@fortawesome/fontawesome-free/css/all.min.css";

// Pages
import Dashboard from './pages/Dashboard';
import Category from './pages/Category';
import Write from './pages/Write';
import About from './pages/About';
import Contact from "./pages/Contact";
import { Footer } from './components/Footer';

// This is the core routing component
const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext); // Use context state

  return (
    <>
      {/* Conditional Header: Show only if authenticated 
        (or add a separate check for public routes if needed)
      */}
      {isAuthenticated && <Header />}

      <Routes>
        {/*
          Root Path: Redirect to dashboard if logged in, otherwise show Login.
          Uses the state from context which is more reactive than localStorage check.
        */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Routes (Authenticated users only) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/category" element={
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        } />

        <Route path="/write" element={
          <ProtectedRoute>
            <Write />
          </ProtectedRoute>
        } />
        
      </Routes>

      <Footer />
    </>
  );
};

// Main App component wraps the router and the AuthProvider
const App = () => {
  return (
    <BrowserRouter>
      {/* The AuthProvider makes the authentication state available to all child components.
        You must implement AuthContext and AuthProvider separately.
      */}
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;