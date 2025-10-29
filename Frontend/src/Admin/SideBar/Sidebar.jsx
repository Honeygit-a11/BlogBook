import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, PenTool, FileText, LayoutDashboard, UserCheck } from "lucide-react";
import "./Sidebar.css"; // external CSS

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: PenTool, label: "Authors", path: "/admin/authors" },
  { icon: UserCheck, label: "Author Requests", path: "/admin/author-requests" },
  { icon: FileText, label: "Posts", path: "/admin/posts" },
];

const Sidebar = ({ children }) => {
  const location = useLocation();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Blog Admin</h1>
          <p className="sidebar-subtitle">Management Panel</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">A</div>
            <div>
              <p className="user-name">Admin User</p>
              <p className="user-email">admin@blog.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Sidebar;
