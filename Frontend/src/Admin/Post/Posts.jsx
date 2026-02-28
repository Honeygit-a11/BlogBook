import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Eye, Edit, Trash2, Search } from "lucide-react";
import "../Post/Posts.css";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleDocClick = () => setOpenMenuId(null);
    document.addEventListener("click", handleDocClick);
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/admin/posts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(Array.isArray(data.posts) ? data.posts : []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  const getStatusLabel = (post) => {
    if (post?.status) return post.status.toLowerCase();
    if (typeof post?.isPublished === "boolean") return post.isPublished ? "published" : "draft";
    if (typeof post?.published === "boolean") return post.published ? "published" : "draft";
    return "published";
  };

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

  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => getStatusLabel(p) === "published").length;
    const draft = posts.filter((p) => getStatusLabel(p) === "draft").length;
    const scheduled = posts.filter((p) => getStatusLabel(p) === "scheduled").length;
    return { total, published, draft, scheduled };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return posts.filter((post) => {
      const title = (post.title || "").toLowerCase();
      const author = (post.author?.username || "").toLowerCase();
      const category = (post.category || "").toLowerCase();
      const matchesTerm =
        !term || title.includes(term) || author.includes(term) || category.includes(term);
      const status = getStatusLabel(post);
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      return matchesTerm && matchesStatus;
    });
  }, [posts, searchTerm, statusFilter]);

  const handleView = (id) => {
    navigate(`/blog/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/write?edit=${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post? This action cannot be undone.")) return;
    try {
      const response = await fetch(`http://localhost:4000/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete post");
      }
      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div className="posts-container min-h-screen px-4 py-6 md:px-8">
        <div className="state-card rounded-2xl bg-white p-4 shadow-sm">Loading posts…</div>
      </div>
    );
  if (error)
    return (
      <div className="posts-container min-h-screen px-4 py-6 md:px-8">
        <div className="state-card error rounded-2xl bg-rose-50 p-4 text-sm text-rose-600">
          {error}
        </div>
      </div>
    );

  return (
    <div className="posts-container min-h-screen px-4 py-6 md:px-8">
      <div className="posts-header flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow text-xs uppercase tracking-[0.3em] font-semibold text-indigo-500">
            Content control
          </span>
          <h1 className="page-title text-3xl font-semibold text-slate-900">Posts</h1>
          <p className="page-subtitle text-sm text-slate-500">
            Review, organize, and manage published content.
          </p>
        </div>
        <div className="meta-pill inline-flex items-center rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
          Total posts: {stats.total}
        </div>
      </div>

      <div className="posts-toolbar grid gap-4 md:grid-cols-[1fr_auto] items-center">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, author, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-row">
          {["all", "published", "draft", "scheduled"].map((status) => (
            <button
              key={status}
              className={`filter-chip ${statusFilter === status ? "active" : ""}`}
              onClick={() => setStatusFilter(status)}
              type="button"
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="post-stats grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card rounded-2xl bg-white p-4 shadow-sm">
          <span>Total posts</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-card rounded-2xl bg-white p-4 shadow-sm">
          <span>Published</span>
          <strong>{stats.published}</strong>
        </div>
        <div className="stat-card rounded-2xl bg-white p-4 shadow-sm">
          <span>Drafts</span>
          <strong>{stats.draft}</strong>
        </div>
        <div className="stat-card rounded-2xl bg-white p-4 shadow-sm">
          <span>Scheduled</span>
          <strong>{stats.scheduled}</strong>
        </div>
      </div>

      <div className="table-wrapper rounded-2xl bg-white shadow-sm">
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
            {filteredPosts.map((post) => (
              <tr key={post._id}>
                <td>
                  <div className="title-cell">
                    {post.image ? (
                      <img src={post.image} alt={post.title} className="post-image" />
                    ) : (
                      <div className="post-image placeholder" />
                    )}
                    <div>
                      <p className="post-title">{post.title || "Untitled post"}</p>
                      <p className="post-excerpt">
                        {post.content ? post.content.substring(0, 100) + "..." : "No excerpt provided."}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  {post.author
                    ? post.author.username || post.author.email || "Unknown"
                    : "Unknown"}
                </td>
                <td>
                  <span className="category-badge">{post.category || "Uncategorized"}</span>
                </td>
                <td>
                  <span className={getStatusClass(getStatusLabel(post))}>
                    {getStatusLabel(post)}
                  </span>
                </td>
                <td>{post.views ?? post.viewCount ?? "—"}</td>
                <td>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "—"}</td>
                <td className="actions-cell">
                  <div
                    className="dropdown"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      className="btn-icon"
                      onClick={() =>
                        setOpenMenuId(openMenuId === post._id ? null : post._id)
                      }
                    >
                      <MoreVertical size={16} />
                    </button>
                    <div
                      className={`dropdown-content ${
                        openMenuId === post._id ? "show" : ""
                      }`}
                    >
                      <button
                        className="dropdown-item"
                        onClick={() => handleView(post._id)}
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        className="dropdown-item"
                        onClick={() => handleEdit(post._id)}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => handleDelete(post._id)}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}

            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-posts">
                  No posts available
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="posts-cards grid gap-4">
        {filteredPosts.map((post) => (
          <article key={post._id} className="post-card rounded-2xl bg-white p-4 shadow-sm">
            <div className="post-card-header">
              {post.image ? (
                <img src={post.image} alt={post.title} className="post-card-image" />
              ) : (
                <div className="post-card-image placeholder" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {post.title || "Untitled post"}
                </h3>
                <span className={getStatusClass(getStatusLabel(post))}>
                  {getStatusLabel(post)}
                </span>
              </div>
            </div>
            <p className="post-card-excerpt">
              {post.content ? post.content.substring(0, 140) + "..." : "No excerpt provided."}
            </p>
            <div className="post-card-meta">
              <div>
                <span>Author</span>
                <strong>
                  {post.author
                    ? post.author.username || post.author.email || "Unknown"
                    : "Unknown"}
                </strong>
              </div>
              <div>
                <span>Category</span>
                <strong>{post.category || "Uncategorized"}</strong>
              </div>
              <div>
                <span>Views</span>
                <strong>{post.views ?? post.viewCount ?? "—"}</strong>
              </div>
              <div>
                <span>Date</span>
                <strong>
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "—"}
                </strong>
              </div>
            </div>
            <div className="post-card-actions">
              <button className="ghost-btn" onClick={() => handleView(post._id)}>
                <Eye size={16} /> View
              </button>
              <button className="ghost-btn" onClick={() => handleEdit(post._id)}>
                <Edit size={16} /> Edit
              </button>
              <button className="ghost-btn danger" onClick={() => handleDelete(post._id)}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </article>
        ))}
        {filteredPosts.length === 0 && (
          <div className="empty-state">
            <h4>No posts available</h4>
            <p>Try a different search term or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
