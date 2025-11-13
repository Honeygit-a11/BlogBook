import React, { useState, useEffect } from "react";
import { MoreVertical, Eye, Edit, Trash2, Plus, Filter } from "lucide-react";
import "../Post/Posts.css";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/admin/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "published":
        return "status-badge published";
      case "draft":
        return "status-badge draft";
      case "scheduled":
        return "status-badge scheduled";
      default:
        return "status-badge";
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="posts-container">
      {/* -------- Header Section -------- */}
      <div className="posts-header">
        <div>
          <h1 className="page-title">Posts</h1>
          <p className="page-subtitle">Manage and organize your blog content</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <Filter size={16} />
            Filter
          </button>
          <button className="btn btn-primary">
            <Plus size={16} />
            New Post
          </button>
        </div>
      </div>

      {/* -------- Table Section -------- */}
      <div className="table-wrapper">
        <table className="posts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Views</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* ✅ FIXED HERE: use posts (not Posts) and check if it’s an array */}
            {Array.isArray(posts) && posts.map((post) => (
              <tr key={post._id}>
                <td>
                  <div className="title-cell">
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="post-image"
                      />
                    )}
                    <div>
                      <p className="post-title">{post.title}</p>
                      <p className="post-excerpt">{post.content ? post.content.substring(0, 100) + '...' : ''}</p>
                    </div>
                  </div>
                </td>
                <td>{post.author ? post.author.username : 'Unknown'}</td>
                <td>
                  <span className="category-badge">{post.category || 'Uncategorized'}</span>
                </td>
                <td>
                  <span className={getStatusClass('published')}>
                    published
                  </span>
                </td>
                <td>0</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="actions-cell">
                  <div className="dropdown">
                    <button className="btn-icon">
                      <MoreVertical size={16} />
                    </button>
                    <div className="dropdown-content">
                      <button className="dropdown-item">
                        <Eye size={14} /> View
                      </button>
                      <button className="dropdown-item">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="dropdown-item text-danger">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}

            {/* ✅ Optional: handle empty list */}
            {!Array.isArray(posts) || posts.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-posts">
                  No posts available
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Posts;
