import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import "../../style/Profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/blogs/author/${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.id) {
      fetchUserBlogs();
    }
  }, [user]);

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      const response = await fetch(`http://localhost:4000/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete blog');
      setBlogs(blogs.filter(blog => blog._id !== blogId));
    } catch (err) {
      alert('Error deleting blog: ' + err.message);
    }
  };

  if (loading) return <div className="profile-status">Loading...</div>;
  if (error) return <div className="profile-status">Error: {error}</div>;

  return (
    <div className="profile-page bg-slate-50 text-slate-900">
      <section className="profile-hero px-4 py-10 md:px-8">
        <div className="profile-container">
          <div className="profile-hero-content">
            <h1 className="hero-title">
              My Profile: <span className="highlight">{user?.username}</span>
            </h1>
            <p className="hero-description">
              Manage your blogs, edit them, or create new ones.
            </p>
            <Link to="/write" className="btn-cta">Write New Blog</Link>
          </div>
        </div>
      </section>

      <section className="profile-blogs px-4 pb-12 md:px-8">
        <div className="profile-container">
          <div className="section-header">
            <h2>My Blogs</h2>
            <p>Your published stories</p>
          </div>

          {blogs.length === 0 ? (
            <p className="profile-empty">
              You haven't written any blogs yet. <Link to="/write">Start writing!</Link>
            </p>
          ) : (
            <div className="profile-grid">
              {blogs.map((blog) => (
                <article key={blog._id} className="profile-card">
                  <div className="profile-image">
                    <img src={blog.image} alt={blog.title} />
                  </div>
                  <div className="profile-content">
                    <h3>{blog.title}</h3>
                    <p className="profile-snippet">{blog.content.split('\n').slice(0, 2).join('\n')}</p>
                    <div className="profile-actions">
                      <Link to={`/blog/${blog._id}`} className="profile-btn">
                        View
                      </Link>
                      <Link to={`/write?edit=${blog._id}`} className="profile-btn">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
