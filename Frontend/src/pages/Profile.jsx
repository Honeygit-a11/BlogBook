import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import "../../style/Dashboard.css"; // Reuse dashboard styles

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
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

      <section className="featured-blogs">
        <div className="container">
          <div className="section-header">
            <h2>My Blogs</h2>
            <p>Your published stories</p>
          </div>

          {blogs.length === 0 ? (
            <p>You haven't written any blogs yet. <Link to="/write">Start writing!</Link></p>
          ) : (
            <div className="blog-grid">
              {blogs.map((blog) => (
                <article key={blog._id} className="blog-card">
                  <div className="blog-image">
                    <img src={blog.image} alt={blog.title} />
                  </div>
                  <div className="blog-content">
                    <h3>{blog.title}</h3>
                    <p className="blog-snippet">{blog.content.split('\n').slice(0, 2).join('\n')}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <Link to={`/blog/${blog._id}`} className="read-more">
                        View
                      </Link>
                      <Link to={`/write?edit=${blog._id}`} className="read-more">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
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
