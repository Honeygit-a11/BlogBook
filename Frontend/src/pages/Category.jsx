import React from "react";
import "../../style/Category.css";
import { FaLaptopCode, FaPalette, FaBriefcase, FaHeartbeat, FaFlask, FaBook } from "react-icons/fa";

const categories = [
  {
    icon: <FaLaptopCode className="cat-icon tech" />,
    title: "Technology",
    articles: "40 articles",
    description: "Latest trends in software development, AI, cybersecurity, and engineering technologies that shape our digital future.",
  },
  {
    icon: <FaPalette className="cat-icon design" />,
    title: "Design",
    articles: "26 articles",
    description: "UI/UX design principles, creative inspiration, design tools, and craft methods for creating stunning digital experiences.",
  },
  {
    icon: <FaBriefcase className="cat-icon business" />,
    title: "Business",
    articles: "22 articles",
    description: "Entrepreneurship insights, startup strategies, market analysis, and business growth tactics for modern companies.",
  },
  {
    icon: <FaHeartbeat className="cat-icon lifestyle" />,
    title: "Lifestyle",
    articles: "17 articles",
    description: "Health and wellness tips, travel experiences, food culture, and personal development for a fulfilling lifestyle.",
  },
  {
    icon: <FaFlask className="cat-icon science" />,
    title: "Science",
    articles: "9 articles",
    description: "Scientific discoveries, research breakthroughs, space exploration, and innovations that advance human knowledge.",
  },
  {
    icon: <FaBook className="cat-icon education" />,
    title: "Education",
    articles: "7 articles",
    description: "Learning methodologies, educational technology, skill development, and resources for career growth.",
  },
];

const popularTags = [
  "#WebDevelopment", "#UIUX", "#Startup", "#AI", "#Productivity", "#Marketing", "#Travel", "#Health"
];

const Category = () => {
  return (
    <div className="category-page">
      <h2 className="category-title">Blog Categories</h2>
      <p className="category-subtitle">
        Discover amazing content organized by topics that interest you most. Explore our diverse collection of articles and insights.
      </p>

      <div className="search-bar">
        <input type="text" placeholder="Search categories..." />
      </div>

      <div className="category-grid">
        {categories.map((cat, index) => (
          <div className="category-card" key={index}>
            <div className="card-header">
              {cat.icon}
              <h3>{cat.title}</h3>
            </div>
            <p className="article-count">{cat.articles}</p>
            <p className="description">{cat.description}</p>
            <button className="explore-btn">Explore →</button>
          </div>
        ))}
      </div>

      <div className="tags-section">
        <h3>Popular Tags</h3>
        <div className="tags">
          {popularTags.map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
