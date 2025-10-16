import React, { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, Edit, Trash2 } from "lucide-react";
import "../Author/Authordetails.css";

const Authordetails = () => {
  const [authors, setAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    status: "active",
  });

  useEffect(() => {
    const storedAuthors = JSON.parse(localStorage.getItem("authors")) || [];
    setAuthors(storedAuthors);
  }, []);

  const saveAuthors = (data) => {
    localStorage.setItem("authors", JSON.stringify(data));
    setAuthors(data);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    const currentAuthors = JSON.parse(localStorage.getItem("authors")) || [];

    if (editingAuthor) {
      const updated = currentAuthors.map((a) =>
        a.id === editingAuthor.id ? { ...a, ...formData } : a
      );
      saveAuthors(updated);
      alert("Author updated successfully");
    } else {
      const newAuthor = {
        id: Date.now().toString(),
        ...formData,
        postsCount: 0,
        joinedDate: new Date().toISOString().split("T")[0],
      };
      saveAuthors([...currentAuthors, newAuthor]);
      alert("Author created successfully");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id) => {
    const filtered = authors.filter((a) => a.id !== id);
    saveAuthors(filtered);
    alert("Author deleted successfully");
  };

  const openDialog = (author) => {
    if (author) {
      setEditingAuthor(author);
      setFormData({
        name: author.name,
        email: author.email,
        bio: author.bio,
        status: author.status,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingAuthor(null);
    setFormData({ name: "", email: "", bio: "", status: "active" });
  };

  const filteredAuthors = authors.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="authors-container">
      <div className="authors-header">
        <div>
          <h2>Authors</h2>
          <p>Manage content creators</p>
        </div>
        <button className="add-btn" onClick={() => openDialog()}>
          <Plus size={18} /> Add Author
        </button>
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
              <th>Name</th>
              <th>Email</th>
              <th>Bio</th>
              <th>Posts</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAuthors.map((author) => (
              <tr key={author.id}>
                <td>{author.name}</td>
                <td>{author.email}</td>
                <td className="truncate">{author.bio}</td>
                <td>
                  <span className="badge gray">{author.postsCount}</span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      author.status === "active" ? "green" : "red"
                    }`}
                  >
                    {author.status}
                  </span>
                </td>
                <td>{author.joinedDate}</td>
                <td className="actions">
                  <button
                    className="icon-btn edit"
                    onClick={() => openDialog(author)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(author.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>{editingAuthor ? "Edit Author" : "Add New Author"}</h3>
            <div className="dialog-body">
              <label>
                Name
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </label>
              <label>
                Bio
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                />
              </label>
              <label>
                Status
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>
            <div className="dialog-footer">
              <button
                className="cancel-btn"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave}>
                {editingAuthor ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Authordetails;
