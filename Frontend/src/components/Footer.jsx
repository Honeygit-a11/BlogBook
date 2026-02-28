import React from "react";
import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container site-footer-wrap">
        <div className="site-footer-grid">
          <div className="site-footer-section">
            <div className="site-footer-logo">
              <span className="site-footer-logo-mark">BB</span>
              <span className="site-footer-logo-text">BlogBook</span>
            </div>
            <p className="site-footer-tagline">Empowering writers and readers worldwide.</p>
          </div>

          <div className="site-footer-section">
            <h4 className="site-footer-title">Resources</h4>
            <ul className="site-footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Writing Guide</a></li>
              <li><a href="#">Community</a></li>
              <li><a href="#">API Docs</a></li>
            </ul>
          </div>

          <div className="site-footer-section">
            <h4 className="site-footer-title">Connect</h4>
            <div className="site-footer-social">
              <a href="#" className="site-social-icon" aria-label="Twitter">X</a>
              <a href="#" className="site-social-icon" aria-label="Facebook">f</a>
              <a href="#" className="site-social-icon" aria-label="Instagram">ig</a>
              <a href="#" className="site-social-icon" aria-label="LinkedIn">in</a>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>&copy; {new Date().getFullYear()} BlogBook. All rights reserved.</p>
          <div className="site-footer-policy-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
