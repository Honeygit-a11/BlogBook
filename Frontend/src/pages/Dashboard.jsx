import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../style/Dashboard.css";
import Pagination from "@mui/material/Pagination";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/blogs');
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const authorBlogs = blogs.filter(blog => blog.author && blog.author.role === 'author');

  const blogsPerPage = 6;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(authorBlogs.length / blogsPerPage);
  const displayedBlogs = authorBlogs.slice(
    (page - 1) * blogsPerPage,
    page * blogsPerPage
  );

  const handleChange = (event, value) => {
    setPage(value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Stories That <span className="highlight">Inspire</span>
            </h1>
            <p className="hero-description">
              Join thousands of readers and writers sharing knowledge, experiences,
              and creativity. Start your journey with the best stories from around
              the world.
            </p>
            <button className="btn-cta">Start Reading</button>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&h=600&fit=crop&q=80"
              alt="Reading and writing inspiration"
            />
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section id="blogs" className="featured-blogs">
        <div className="container">
          <div className="section-header">
            <h2>Featured Stories</h2>
            <p>Handpicked articles from our talented community</p>
          </div>

          <div className="blog-grid">
            {displayedBlogs.map((blog) => (
              <article key={blog._id} className="blog-card">
                <div className="blog-image">
                  <img src={blog.image} alt={blog.title} />
                </div>
                <div className="blog-content">
                  <h3>{blog.title}</h3>
                  <p className="blog-snippet">{blog.content.split('\n').slice(0, 2).join('\n')}</p>
                  <Link to={`/blog/${blog._id}`} className="read-more">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination-container">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChange}
              color="primary"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Our Mission</h2>
              <p>
                At BlogSpace, we believe everyone has a story worth sharing. Our
                platform empowers writers, thinkers, and creators to express their
                ideas and connect with a global audience.
              </p>
              <p>
                We're building a community where quality content meets passionate
                readers, where knowledge is freely shared, and where every voice
                matters.
              </p>
              <div className="stats">
                <div className="stat-item">
                  <h3>50K+</h3>
                  <p>Active Writers</p>
                </div>
                <div className="stat-item">
                  <h3>1M+</h3>
                  <p>Monthly Readers</p>
                </div>
                <div className="stat-item">
                  <h3>100K+</h3>
                  <p>Published Stories</p>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80"
                alt="Our community"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Get the best stories delivered straight to your inbox every week</p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                required
              />
              <button type="submit" className="btn-subscribe">
                Subscribe
              </button>
            </form>
            <p className="privacy-note">
              We are respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
