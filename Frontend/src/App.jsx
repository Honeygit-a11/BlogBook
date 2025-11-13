import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Signup from './components/Signup';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, AuthContext } from './context/Authcontext'; 
import AdminLayout from './Layout/AdminLayout';
import "@fortawesome/fontawesome-free/css/all.min.css";

// Pages
import Dashboard from './pages/Dashboard';
import Category from './pages/Category';
import CategoryBlogs from './pages/CategoryBlogs';
import Write from './pages/Write';
import About from './pages/About';
import Contact from "./pages/Contact";
import BlogDetail from './pages/BlogDetail';
import { Footer } from './components/Footer';

// Admin Pages
import AdminDashboard from './Admin/Dashboard/Details';
import UserDetails from './Admin/User/UserDetails';
import AuthorDetails from './Admin/Author/Authordetails';
import PendingAuthorRequests from './Admin/Author/PendingAuthorRequests';
import AuthorRequest from './pages/AuthorRequest';
import Profile from './pages/Profile';
import Post from './Admin/Post/Posts';


const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext); 

  return (
    <>
     
      {isAuthenticated && <Header />}

      <Routes>
       
        <Route path="/" element={<Login />} />

   
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

  
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

        <Route path="/category/:category" element={
          <ProtectedRoute>
            <CategoryBlogs />
          </ProtectedRoute>
        } />

        <Route path="/write" element={
          <ProtectedRoute authorOnly={true}>
            <Write />
          </ProtectedRoute>
        } />

         <Route path="/author" element={
          <ProtectedRoute>
            <AuthorRequest />
          </ProtectedRoute>
        } />

        <Route path="/blog/:id" element={
          <ProtectedRoute>
            <BlogDetail />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Admin Routes (Admin only) */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout>
              <UserDetails />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/authors" element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout>
              <AuthorDetails />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/author-requests" element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout>
              <PendingAuthorRequests />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
         <Route path="/admin/posts" element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout>
              <Post />
            </AdminLayout>
          </ProtectedRoute>
        } /> 
        <Route path="/admin/dashboard" element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />

      </Routes>

      <Footer />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
);
};

export default App;