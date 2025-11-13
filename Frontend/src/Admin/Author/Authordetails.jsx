import React, { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, Edit, Trash2, UserX } from "lucide-react";
import "../Author/Authordetails.css";

const Authordetails = () => {
  const [authors, setAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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
      } else {
        alert(data.message || 'Failed to fetch authors');
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      alert('An error occurred while fetching authors');
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

  const filteredAuthors = authors.filter(
    (a) =>
      a.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="authors-container"><p>Loading...</p></div>;
  }

  return (
    <div className="authors-container">
      <div className="authors-header">
        <div>
          <h2>Authors</h2>
          <p>Manage content creators</p>
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

      <div className="authors-table">
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
                <td>{author.username}</td>
                <td>{author.email}</td>
                <td>
                  <span className="badge green">Author</span>
                </td>
                <td>{new Date(author.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  <button
                    className="icon-btn"
                    onClick={() => handleConvertToUser(author._id)}
                    title="Convert to User"
                    style={{ backgroundColor: '#FF9800', color: 'white' }}
                  >
                    <UserX size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Authordetails;
