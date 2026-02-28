import React from 'react';
import '../../style/Contact.css';

// Helper component for Contact Info entries
const ContactInfoItem = ({ iconClass, title, content, subContent }) => (
  <div className="info-item">
    <i className={`icon ${iconClass}`}></i>
    <div>
      <p className="info-title">{title}</p>
      <p className="info-content">{content}</p>
      {subContent && <p className="info-sub-content">{subContent}</p>}
    </div>
  </div>
);

// Helper component for Follow Us entries
const SocialLink = ({ iconClass, platform, handle }) => (
  <a href="#" className="social-link">
    <i className={`icon ${iconClass}`}></i>
    <div>
      <p className="platform-name">{platform}</p>
      <p className="platform-handle">{handle}</p>
    </div>
  </a>
);

const ContactPage = () => {
  // Simple form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message Sent (In a real app, this would submit to a backend)');
  };

  return (
    <div className="contact-page-container bg-slate-50 text-slate-900">
      {/* ======================= LEFT COLUMN: CONTACT FORM ======================= */}
      <div className="contact-form-section">
        <h2>Send us a message</h2>
        <form onSubmit={handleSubmit}>
          {/* Name Fields (Two-column layout within the form) */}
          <div className="name-fields">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" placeholder="John" required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" placeholder="Doe" required />
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="john.doe@example.com" required />
          </div>

          {/* Subject Field (Dropdown) */}
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <select id="subject" defaultValue="">
              <option value="" disabled>Select a subject</option>
              <option value="support">Support</option>
              <option value="sales">Sales Inquiry</option>
              <option value="general">General Feedback</option>
            </select>
          </div>

          {/* Message Field (Textarea) */}
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="5" placeholder="Tell us how we can help you..."></textarea>
          </div>

          {/* Checkbox and Button Container */}
          <div className="form-bottom-row">
            <div className="checkbox-group">
              <input type="checkbox" id="newsletter" />
              <label htmlFor="newsletter">I'd like to receive updates and newsletters from BlogSpace</label>
            </div>
            <button type="submit" className="send-button">
              Send Message <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>

      {/* ======================= RIGHT COLUMN: SIDEBAR ======================= */}
      <aside className="contact-info-sidebar">
        {/* Contact Information Block */}
        <div className="contact-information-block">
          <h3>Contact Information</h3>
          <ContactInfoItem 
            iconClass="fas fa-envelope"
            title="Email"
            content="hello@blogspace.com"
            subContent="support@blogspace.com"
          />
          <ContactInfoItem 
            iconClass="fas fa-phone"
            title="Phone"
            content="+1 (555) 123-4567"
            subContent="Mon-Fri: 9AM-5PM EST"
          />
          <ContactInfoItem 
            iconClass="fas fa-map-marker-alt"
            title="Address"
            content="123 Blog Street, Content City, CC 12345"
            subContent="United States"
          />
        </div>

        {/* Follow Us Block */}
        <div className="follow-us-block">
          <h3>Follow Us</h3>
          <SocialLink 
            iconClass="fab fa-twitter"
            platform="Twitter"
            handle="@blogspace"
          />
          <SocialLink 
            iconClass="fab fa-facebook-f"
            platform="Facebook"
            handle="BlogSpace Official"
          />
          <SocialLink 
            iconClass="fab fa-instagram"
            platform="Instagram"
            handle="@blogspace_official"
          />
          <SocialLink 
            iconClass="fab fa-linkedin-in"
            platform="LinkedIn"
            handle="BlogSpace Company"
          />
        </div>
      </aside>
    </div>
  );
};

export default ContactPage;
