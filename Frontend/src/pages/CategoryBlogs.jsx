import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../../style/CategoryBlogs.css";
import Pagination from "@mui/material/Pagination";

const CategoryBlogs = () => {
  const { category } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/blogs/category/${category}`);
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await response.json();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [category]);

  useEffect(() => {
    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
    setPage(1); // Reset to first page when filtering
  }, [searchTerm, blogs]);

  const blogsPerPage = 6;
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const displayedBlogs = filteredBlogs.slice(
    (page - 1) * blogsPerPage,
    page * blogsPerPage
  );

  const handleChange = (event, value) => {
    setPage(value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="category-blogs-page bg-slate-50 text-slate-900">
      <div className="container px-4 py-10 md:px-8">
        <div className="category-header">
          <h1>{category} Blogs</h1>
          <p>Discover all stories in the {category} category</p>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="no-blogs">
            <p>No blogs found in this category.</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryBlogs;


