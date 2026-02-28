import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import "../User/UserDetails.css"; // external CSS file

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
    password: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setUsers([]);
        return;
      }

      const response = await fetch('http://localhost:4000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(Array.isArray(data.users) ? data.users : []);
      } else {
        setError(data.message || "Failed to fetch users.");
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError("An error occurred while fetching users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        password: ""
      });
    } else {
      setEditingUser(null);
      setFormData({ username: "", email: "", role: "user", password: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setNotice("");
    if (!formData.username || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }
    if (!editingUser && !formData.password) {
      alert("Password is required for new users");
      return;
    }

    const payload = {
      username: formData.username,
      email: formData.email,
      role: formData.role
    };
    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      const url = editingUser
        ? `http://localhost:4000/api/admin/users/${editingUser._id}`
        : "http://localhost:4000/api/admin/users";
      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        setNotice(editingUser ? "User updated successfully." : "User created successfully.");
        await fetchUsers();
        setIsDialogOpen(false);
      } else {
        alert(data.message || "Failed to save user");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("An error occurred while saving the user");
    }
  };

  const handleDelete = async (id) => {
    setNotice("");
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`http://localhost:4000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(users.filter((u) => u._id !== id));
        setNotice("User deleted successfully.");
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user');
    }
  };

  return (
    <div className="users-page min-h-screen px-4 py-6 md:px-8">
      <div className="users-header flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-indigo-500">
            Admin overview
          </span>
          <h2 className="text-3xl font-semibold text-slate-900">Users</h2>
          <p className="text-sm text-slate-500">Manage all users in your blog</p>
        </div>
        <button
          className="btn primary inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
          onClick={() => openDialog()}
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {notice && (
        <p className="users-notice rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">
          {notice}
        </p>
      )}
      {error && (
        <p className="users-error rounded-2xl bg-rose-50 p-3 text-sm text-rose-600">
          {error}
        </p>
      )}

      <div className="users-table-container rounded-2xl bg-white shadow-sm">
        {loading ? (
          <p className="no-data text-sm text-slate-500">Loading users...</p>
        ) : (
          <>
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="bold">{user.username || "-"}</td>
                    <td>{user.email || "-"}</td>
                    <td>
                      <span className={`badge ${user.role}`}>{user.role}</span>
                    </td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                    <td className="actions-cell">
                      <button
                        className="btn small inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50"
                        onClick={() => openDialog(user)}
                        aria-label={`Edit ${user.username || "user"}`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn small danger inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600"
                        onClick={() => handleDelete(user._id)}
                        aria-label={`Delete ${user.username || "user"}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <p className="no-data text-sm text-slate-500">
                {users.length === 0 ? "No users available." : "No users match your search."}
              </p>
            )}
          </>
        )}
      </div>

      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-slate-900">
              {editingUser ? "Edit User" : "Add New User"}
            </h3>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Enter username"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email"
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="admin">Admin</option>
                <option value="author">Author</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="form-group">
              <label>{editingUser ? "Reset Password (optional)" : "Password"}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
              />
            </div>

            <div className="dialog-actions">
              <button
                className="btn rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn primary rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                onClick={handleSave}
              >
                {editingUser ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
