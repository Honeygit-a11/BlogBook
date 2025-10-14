import React from 'react'

export const Footer = () => {
  return (
    <>
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
    </>
  )
}
