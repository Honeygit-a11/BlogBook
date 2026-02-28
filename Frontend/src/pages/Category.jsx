import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  "Web Development", "UI/UX", "Startup", "AI", "Productivity", "Marketing", "Travel", "Health"
];

const Category = () => {
  const [query, setQuery] = useState("");
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/blogs/categories/counts");
        const data = await response.json();
        if (response.ok && Array.isArray(data.counts)) {
          const map = {};
          data.counts.forEach((item) => {
            map[item.category] = item.count;
          });
          setCounts(map);
        }
      } catch (error) {
        console.error("Error fetching category counts:", error);
      }
    };
    fetchCounts();
  }, []);

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((cat) =>
      [cat.title, cat.description, cat.articles].join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="category-page bg-slate-50 text-slate-900">
      <section className="category-hero px-4 py-10 md:px-8">
        <div className="hero-content">
          <span className="eyebrow">Explore Topics</span>
          <h2 className="category-title">Blog Categories</h2>
          <p className="category-subtitle">
            Discover stories organized by themes that match your curiosity and your work.
          </p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search categories, topics, or keywords"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-stat">
            <span className="stat-value">120+</span>
            <span className="stat-label">Insights published</span>
          </div>
          <div className="hero-stat">
            <span className="stat-value">24</span>
            <span className="stat-label">Featured authors</span>
          </div>
          <div className="hero-stat">
            <span className="stat-value">Weekly</span>
            <span className="stat-label">New releases</span>
          </div>
        </div>
      </section>

      <div className="category-grid">
        {filteredCategories.map((cat, index) => (
          <div className="category-card" key={index}>
            <div className="card-header">
              {cat.icon}
              <h3>{cat.title}</h3>
            </div>
            <p className="article-count">
              {typeof counts[cat.title] === "number"
                ? `${counts[cat.title]} articles`
                : cat.articles}
            </p>
            <p className="description">{cat.description}</p>
            <Link to={`/category/${cat.title.toLowerCase()}`} className="explore-btn">
              Explore -&gt;
            </Link>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="empty-state">
          <h3>No categories found</h3>
          <p>Try a different keyword or select a popular tag below.</p>
        </div>
      )}

      <div className="tags-section">
        <h3>Popular Tags</h3>
        <div className="tags">
          {popularTags.map((tag, i) => (
            <button
              key={i}
              className="tag"
              onClick={() => setQuery(tag)}
              type="button"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;

