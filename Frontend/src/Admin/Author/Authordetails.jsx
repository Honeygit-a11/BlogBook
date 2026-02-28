import React, { useState, useEffect } from "react";
import { Search, UserX } from "lucide-react";
import "../Author/Authordetails.css";

const Authordetails = () => {
  const [authors, setAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/admin/authors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setAuthors(data.authors);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch authors');
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      setError('An error occurred while fetching authors');
    }
    setLoading(false);
  };

  const handleConvertToUser = async (id) => {
    if (!window.confirm('Are you sure you want to convert this author to a user?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/admin/authors/${id}/convert-to-user`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        alert('Author converted to user successfully');
        fetchAuthors(); // Refresh the list
      } else {
        alert(data.message || 'Failed to convert author');
      }
    } catch (error) {
      console.error('Error converting author:', error);
      alert('An error occurred while converting the author');
    }
  };

  const filteredAuthors = authors.filter((a) => {
    const username = (a.username || "").toLowerCase();
    const email = (a.email || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return username.includes(term) || email.includes(term);
  });

  if (loading) {
    return (
      <div className="authors-container min-h-screen px-4 py-6 md:px-8">
        <div className="state-card rounded-2xl bg-white p-4 shadow-sm">Loading authors…</div>
      </div>
    );
  }

  return (
    <div className="authors-container min-h-screen px-4 py-6 md:px-8">
      <div className="authors-header flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow text-xs uppercase tracking-[0.3em] font-semibold text-indigo-500">
            Admin overview
          </span>
          <h2 className="text-3xl font-semibold text-slate-900">Authors</h2>
          <p className="text-sm text-slate-500">Manage content creators</p>
        </div>
        <div className="meta-pill inline-flex items-center rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
          Total authors: {authors.length}
        </div>
      </div>

      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="state-card error rounded-2xl bg-rose-50 p-4 text-sm text-rose-600">
          {error}
        </div>
      )}

      <div className="authors-table">
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuthors.map((author) => (
                <tr key={author._id}>
                  <td>{author.username || "—"}</td>
                  <td className="truncate">{author.email || "—"}</td>
                  <td>
                    <span className="badge green">Author</span>
                  </td>
                  <td>{author.createdAt ? new Date(author.createdAt).toLocaleDateString() : "—"}</td>
                  <td className="actions">
                    <button
                      className="icon-btn warn"
                      onClick={() => handleConvertToUser(author._id)}
                      title="Convert to User"
                    >
                      <UserX size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAuthors.length === 0 && (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state text-center text-sm text-slate-500">
                      <h4 className="text-base font-semibold text-slate-900">No authors found</h4>
                      <p>Try a different search term or check back later.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Authordetails;
