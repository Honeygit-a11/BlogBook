import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../style/Dashboard.css";
import Pagination from "@mui/material/Pagination";

const fallbackImage =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&q=80";

const getReadTime = (content = "") => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(2, Math.round(words / 200));
  return `${minutes} min read`;
};

const Dashboard = ({ searchTerm = "" }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/blogs");
        if (!response.ok) throw new Error("Failed to fetch blogs");
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

  const sortedBlogs = [...blogs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const trendingBlogs = sortedBlogs.slice(0, 6);
  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)))];
  const filteredBlogsByCategory =
    activeCategory === "All"
      ? sortedBlogs
      : sortedBlogs.filter((blog) => blog.category === activeCategory);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredBlogs = normalizedSearch
    ? filteredBlogsByCategory.filter((blog) => {
        const title = (blog.title || "").toLowerCase();
        const content = (blog.content || "").toLowerCase();
        const author = (blog.author?.username || "").toLowerCase();
        const category = (blog.category || "").toLowerCase();
        return (
          title.includes(normalizedSearch) ||
          content.includes(normalizedSearch) ||
          author.includes(normalizedSearch) ||
          category.includes(normalizedSearch)
        );
      })
    : filteredBlogsByCategory;

  const blogsPerPage = 6;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const displayedBlogs = filteredBlogs.slice(
    (page - 1) * blogsPerPage,
    page * blogsPerPage
  );

  const handleChange = (event, value) => {
    setPage(value);
  };

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="landing-page bg-slate-50 text-slate-900">
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>Human stories and bold ideas.</h1>
            <p>
              A place to read, write, and build your understanding of the things
              that move our world. Discover thoughtful essays, practical guides,
              and narratives from every corner of the community.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => scrollToSection("latest")}>
                Start reading
              </button>
              <Link to="/author" className="btn-outline">
                Become an author
              </Link>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-orb" />
            <div className="hero-gridlines" />
            <div className="hero-card">
              <span>BlogBook Dispatch</span>
              <h4>Stories that spark your next big idea.</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="trending-section">
        <div className="container">
          <div className="section-title">Trending on BlogBook</div>
          <div className="trending-grid">
            {trendingBlogs.map((blog, index) => (
              <article key={blog._id} className="trending-card">
                <div className="trend-rank">0{index + 1}</div>
                <div className="trend-content">
                  <span className="trend-author">By {blog.author?.username || "Guest"}</span>
                  <h3>{blog.title}</h3>
                  <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="latest" className="feed-section">
        <div className="container feed-grid">
          <div className="feed-main">
            <div className="feed-header">
              <h2>Latest</h2>
              <div className="category-bar">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-chip ${activeCategory === category ? "active" : ""}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="feed-list">
              {displayedBlogs.map((blog) => (
                <article key={blog._id} className="feed-card">
                  <div className="feed-content">
                    <div className="meta-line">
                      <span>By {blog.author?.username || "Guest"}</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span>{getReadTime(blog.content)}</span>
                    </div>
                    <h3 className="feed-title">{blog.title}</h3>
                    <p className="feed-snippet">
                      {(blog.content || "").split("\n").slice(0, 2).join("\n")}
                    </p>
                    <div className="feed-actions">
                      <span className="feed-tag">{blog.category || "Uncategorized"}</span>
                      <Link to={`/blog/${blog._id}`} className="text-link">
                        Read story
                      </Link>
                    </div>
                  </div>
                  <div className="feed-media">
                    <img src={blog.image || fallbackImage} alt={blog.title} />
                  </div>
                </article>
              ))}
            </div>

            {displayedBlogs.length === 0 && (
              <div className="empty-state">
                <h3>No stories yet</h3>
                <p>Try another category or check back soon.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination-container">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChange}
                  color="primary"
                />
              </div>
            )}
          </div>

          <aside className="feed-aside">
            <div className="aside-card">
              <h3>Discover more of what matters</h3>
              <p>
                Follow topics that shape your work, curiosity, and craft. We curate
                the best reads based on what the community is talking about now.
              </p>
              <div className="aside-tags">
                {categories.slice(0, 8).map((category) => (
                  <span key={category}>{category}</span>
                ))}
              </div>
              <Link to="/category" className="aside-link">
                Explore all categories
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="about-section">
        <div className="container about-grid">
          <div>
            <h2>Our Mission</h2>
            <p>
              BlogBook is a home for writers, builders, and curious readers. We
              champion ideas that deserve more space and conversations that move
              beyond the headlines.
            </p>
            <div className="stats">
              <div>
                <h3>50K+</h3>
                <p>Active writers</p>
              </div>
              <div>
                <h3>1M+</h3>
                <p>Monthly readers</p>
              </div>
              <div>
                <h3>100K+</h3>
                <p>Published stories</p>
              </div>
            </div>
          </div>
          <div className="about-panel">
            <h4>Make your next idea public.</h4>
            <p>
              Share your work with people who value depth, clarity, and craft.
              Great stories start here.
            </p>
            <Link to="/write" className="btn-primary">
              Start writing
            </Link>
          </div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container newsletter-content">
          <h2>Stay in the loop</h2>
          <p>Get the best stories delivered straight to your inbox every week.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
          <p className="privacy-note">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
