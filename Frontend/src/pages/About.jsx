import React from "react";
import { BookOpen, Pen, Heart, Users, Mail, Twitter, Github, Linkedin } from "lucide-react";
import "../../style/About.css";

/* Reusable Components */
const Card = ({ children, className }) => (
  <div className={`card ${className || ""}`}>{children}</div>
);

const Badge = ({ children }) => (
  <span className="topic-badge">{children}</span>
);

const Button = ({ icon, children }) => (
  <button className="social-btn">
    {icon}
    <span>{children}</span>
  </button>
);

export default function About() {
  return (
    <div className="about-container bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <div className="hero-section1">
        <div className="hero-content">
          <div className="hero-icon">
            <BookOpen size={64} />
          </div>
          <h1 className="hero-title">About Our Blog</h1>
          <p className="hero-subtitle">
            Sharing stories, insights, and knowledge with the world
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Mission Statement */}
        <Card className="mission-card">
          <div className="card-header">
            <Heart size={32} className="section-icon" />
            <h2 className="section-title">Our Mission</h2>
          </div>
          <p className="card-text">
            We believe in the power of words to inspire, educate, and connect people. 
            Our blog is a platform where ideas come to life, where diverse voices share 
            their experiences, and where readers discover fresh perspectives on topics 
            that matter most.
          </p>
        </Card>

        {/* What We Write About */}
        <Card className="topics-card">
          <div className="card-header">
            <Pen size={32} className="section-icon" />
            <h2 className="section-title">What We Write About</h2>
          </div>
          <div className="topics-grid">
            {[
              "Technology",
              "Lifestyle",
              "Travel",
              "Food & Recipes",
              "Personal Growth",
              "Business",
              "Health & Wellness",
              "Creative Arts",
              "Science",
            ].map(topic => (
              <Badge key={topic}>{topic}</Badge>
            ))}
          </div>
        </Card>

        {/* Our Story */}
        <Card className="story-card">
          <h2 className="section-title">Our Story</h2>
          <div className="story-content">
            <p>
              Founded in 2024, our blog started as a passion project by a group of 
              enthusiastic writers who wanted to create a space for authentic, 
              thoughtful content.
            </p>
            <p>
              What began as a small collection of personal essays has grown into a 
              vibrant community of readers and contributors from around the world. 
              Today, we publish fresh content regularly, covering a wide range of 
              topics that resonate with curious minds.
            </p>
            <p>
              We're committed to maintaining high editorial standards while keeping 
              our content accessible, engaging, and valuable to our readers.
            </p>
          </div>
        </Card>

        {/* Team Section */}
        <Card className="team-card">
          <div className="card-header">
            <Users size={32} className="section-icon" />
            <h2 className="section-title">Our Team</h2>
          </div>
          <p className="card-text team-intro">
            We're a diverse team of writers, editors, and creative thinkers who share 
            a common love for storytelling and knowledge sharing. Each member brings 
            unique expertise and perspective, making our content rich and varied.
          </p>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">1</div>
              <div className="stat-label">Chief Editor</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">15+</div>
              <div className="stat-label">Contributing Writers</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Community Members</div>
            </div>
          </div>
        </Card>

        <hr className="separator" />

        {/* Contact Section */}
        <div className="contact-section">
          <h2 className="section-title">Get in Touch</h2>
          <p className="contact-text">
            Have questions, suggestions, or want to contribute? We'd love to hear from you!
          </p>
          <div className="social-buttons">
           <a href="https://mail.google.com/mail/u/0/#inbox"> <Button icon={<Mail size={20} />}>Email Us</Button></a>
            <a href="https://x.com/?lang=en"><Button icon={<Twitter size={20} />}>Twitter</Button></a>
            <a href="https://github.com/"><Button icon={<Github size={20} />}>GitHub</Button></a>
            <a href="https://www.linkedin.com/home?originalSubdomain=in"><Button icon={<Linkedin size={20} />}>LinkedIn</Button></a>
          </div>
        </div>
      </div>
    </div>
  );
}
