import React from "react";
import "../../style/Dashboard.css"

const Dashboard = () => {
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
            {[
              {
                title: "The Future of Technology",
                desc: "Explore how emerging technologies are reshaping our world...",
                img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop&q=80",
              },
              {
                title: "Finding Inner Peace",
                desc: "A journey through mindfulness and meditation practices...",
                img: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&h=400&fit=crop&q=80",
              },
              {
                title: "Creative Design Tips",
                desc: "Master the art of visual storytelling with these essentials...",
                img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop&q=80",
              },
              {
                title: "Travel Adventures Await",
                desc: "Discover hidden gems and unforgettable travel experiences...",
                img: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&h=400&fit=crop&q=80",
              },
              {
                title: "Writing Mastery",
                desc: "Unlock your creative potential with proven writing techniques...",
                img: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop&q=80",
              },
              {
                title: "Coding Best Practices",
                desc: "Level up your development skills with expert coding patterns...",
                img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80",
              },
            ].map((blog, i) => (
              <article key={i} className="blog-card">
                <div className="blog-image">
                  <img src={blog.img} alt={blog.title} />
                </div>
                <div className="blog-content">
                  <h3>{blog.title}</h3>
                  <p>{blog.desc}</p>
                  <a href="#" className="read-more">
                    Read More →
                  </a>
                </div>
              </article>
            ))}
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
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <span className="logo-icon">✍️</span>
                <span className="logo-text">BlogSpace</span>
              </div>
              <p>Empowering writers and readers worldwide</p>
            </div>

            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Writing Guide</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">API Docs</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Connect</h4>
              <div className="social-links">
                <a href="#" className="social-icon" aria-label="Twitter">𝕏</a>
                <a href="#" className="social-icon" aria-label="Facebook">f</a>
                <a href="#" className="social-icon" aria-label="Instagram">📷</a>
                <a href="#" className="social-icon" aria-label="LinkedIn">in</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 BlogSpace. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default Dashboard
