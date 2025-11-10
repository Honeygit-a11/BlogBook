import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../../style/BlogDetails.css";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/blogs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch blog');
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <div className="blog-detail-page1">
      <div className="container1">
        <article className="blog-detail1">
          <div className="blog-image1">
            <img src={blog.image} alt={blog.title} />
          </div>
          <div className="blog-content1">
            <h1>{blog.title}</h1>
            <p className="blog-meta1">
              By {blog.author?.username || 'Unknown Author'} | Category: {blog.category}
            </p>
            <div className="blog-full-content1">
              {blog.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
