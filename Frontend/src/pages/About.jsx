import React from "react";
import { BookOpen, Pen, Heart, Users, Mail, Twitter, Github, Linkedin } from "lucide-react";
import "../../style/About.css";

/* Simple UI Components */
const Card = ({ children, className }) => (
  <div className={`card ${className || ""}`}>{children}</div>
);
const CardContent = ({ children, className }) => (
  <div className={`card-content ${className || ""}`}>{children}</div>
);
const Badge = ({ children, className }) => (
  <span className={`badge ${className || ""}`}>{children}</span>
);
const Button = ({ children, className, onClick }) => (
  <button className={`button ${className || ""}`} onClick={onClick}>{children}</button>
);
const Separator = ({ className }) => <hr className={`separator ${className || ""}`} />;

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-icon"><BookOpen /></div>
          <h1>About Our Blog</h1>
          <p>Sharing stories, insights, and knowledge with the world</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Mission Statement */}
        <Card>
          <CardContent>
            <div className="section-header">
              <Heart className="icon heart" />
              <h2>Our Mission</h2>
            </div>
            <p>
              We believe in the power of words to inspire, educate, and connect people.
              Our blog is a platform where ideas come to life, where diverse voices share
              their experiences, and where readers discover fresh perspectives on topics
              that matter most.
            </p>
          </CardContent>
        </Card>

        {/* What We Write About */}
        <Card>
          <CardContent>
            <div className="section-header">
              <Pen className="icon pen" />
              <h2>What We Write About</h2>
            </div>
            <div className="badge-grid">
              {[
                "Technology","Lifestyle","Travel","Food & Recipes",
                "Personal Growth","Business","Health & Wellness",
                "Creative Arts","Science"
              ].map(topic => (
                <Badge key={topic}>{topic}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Our Story */}
        <Card>
          <CardContent>
            <h2>Our Story</h2>
            <div className="story-text">
              <p>Founded in 2024, our blog started as a passion project by a group of enthusiastic writers who wanted to create a space for authentic, thoughtful content.</p>
              <p>What began as a small collection of personal essays has grown into a vibrant community of readers and contributors from around the world. Today, we publish fresh content regularly, covering a wide range of topics that resonate with curious minds.</p>
              <p>We're committed to maintaining high editorial standards while keeping our content accessible, engaging, and valuable to our readers.</p>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card>
          <CardContent>
            <div className="section-header">
              <Users className="icon users" />
              <h2>Our Team</h2>
            </div>
            <p className="team-text">
              We're a diverse team of writers, editors, and creative thinkers who share a common love for storytelling and knowledge sharing. Each member brings unique expertise and perspective, making our content rich and varied.
            </p>
            <div className="team-stats">
              {[
                { role: "Chief Editor", count: "1" },
                { role: "Contributing Writers", count: "15+" },
                { role: "Community Members", count: "10K+" },
              ].map(stat => (
                <div key={stat.role} className="stat-card">
                  <div className="stat-count">{stat.count}</div>
                  <div className="stat-role">{stat.role}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Contact Section */}
        <div className="contact-section">
          <h2>Get in Touch</h2>
          <p>Have questions, suggestions, or want to contribute? We'd love to hear from you!</p>
          <div className="contact-buttons">
            <Button><Mail /> Email Us</Button>
            <Button><Twitter /> Twitter</Button>
            <Button><Github /> GitHub</Button>
            <Button><Linkedin /> LinkedIn</Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <p>© 2024 Our Blog. All rights reserved.</p>
        <p className="footer-note">Made with passion and dedication</p>
      </footer>
    </div>
  );
};

export default About;
