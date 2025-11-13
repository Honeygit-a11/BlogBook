import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import "../../style/BlogDetails.css";

const BlogDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/blogs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch blog');
        const data = await response.json();
        setBlog(data);
        setLikes(data.likes?.length || 0);
        setIsLiked(data.likes?.includes(user?.id) || false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/blogs/${id}/comments`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchBlog();
    fetchComments();
  }, [id, user]);

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/blogs/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to like blog');
      const data = await response.json();
      setLikes(data.likes);
      setIsLiked(data.isLiked);
    } catch (err) {
      alert('Error liking blog: ' + err.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await fetch(`http://localhost:4000/api/blogs/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text: newComment })
      });
      if (!response.ok) throw new Error('Failed to add comment');
      const newCommentData = await response.json();
      setComments([...comments, newCommentData]);
      setNewComment('');
    } catch (err) {
      alert('Error adding comment: ' + err.message);
    }
  };

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

            {/* Like Section */}
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={handleLike}
                style={{
                  background: isLiked ? '#ff4081' : '#f0f0f0',
                  color: isLiked ? 'white' : 'black',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                {isLiked ? 'Unlike' : 'Like'} ({likes})
              </button>
            </div>

            {/* Comments Section */}
            <div style={{ marginTop: '30px' }}>
              <h3>Comments</h3>
              {comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                <div>
                  {comments.map((comment, index) => (
                    <div key={index} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                      <strong>{comment.user?.username || 'Anonymous'}:</strong> {comment.text}
                      <br />
                      <small>{new Date(comment.createdAt).toLocaleString()}</small>
                    </div>
                  ))}
                </div>
              )}

              {user && (
                <form onSubmit={handleCommentSubmit} style={{ marginTop: '20px' }}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows="4"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  />
                  <button
                    type="submit"
                    style={{ marginTop: '10px', padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Submit Comment
                  </button>
                </form>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
