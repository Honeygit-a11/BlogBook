import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import "../User/UserDetails.css"; // external CSS file
// import { getUsers, saveUsers } from "../lib/storage";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "reader",
    status: "active",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
  };

  const saveUsers = (data) => {
    localStorage.setItem('users', JSON.stringify(data));
    setUsers(data);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    const currentUsers = users;
    if (editingUser) {
      const updated = currentUsers.map((u) =>
        u.id === editingUser.id ? { ...u, ...formData } : u
      );
      saveUsers(updated);
      alert("User updated successfully");
    } else {
      const newUser = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      saveUsers([...currentUsers, newUser]);
      alert("User created successfully");
    }

    loadUsers();
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id) => {
    const currentUsers = users;
    saveUsers(currentUsers.filter((u) => u.id !== id));
    loadUsers();
    alert("User deleted successfully");
  };

  const openDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "reader", status: "active" });
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h2>Users</h2>
          <p>Manage all users in your blog</p>
        </div>
        <button className="btn primary" onClick={() => openDialog()}>
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

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="bold">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role}`}>{user.role}</span>
                </td>
                <td>
                  <span className={`badge ${user.status}`}>{user.status}</span>
                </td>
                <td>{user.createdAt}</td>
                <td>
                  <button
                    className="btn small"
                    onClick={() => openDialog(user)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn small danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="no-data">No users found.</p>
        )}
      </div>

      {/* Dialog (popup form) */}
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter name"
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
                <option value="reader">Reader</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="dialog-actions">
              <button className="btn" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </button>
              <button className="btn primary" onClick={handleSave}>
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
