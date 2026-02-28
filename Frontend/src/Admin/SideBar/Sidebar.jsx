import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, PenTool, FileText, LayoutDashboard, UserCheck, LogOut } from "lucide-react";
import "./Sidebar.css"; // external CSS
import { AuthContext } from "../../context/Authcontext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: PenTool, label: "Authors", path: "/admin/authors" },
  { icon: UserCheck, label: "Author Requests", path: "/admin/author-requests" },
  { icon: FileText, label: "Posts", path: "/admin/posts" },
];

const Sidebar = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const displayName = user?.username || "Admin";
  const displayEmail = user?.email || "admin@blog.com";
  const avatarLetter = (displayName[0] || "A").toUpperCase();

  return (
    <div className="dashboard-container flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="sidebar w-full max-w-[260px] bg-white/90 shadow-lg">
        <div className="sidebar-header border-b border-slate-100 px-5 py-6">
          <h1 className="sidebar-title text-xl font-semibold text-slate-900">Blog Admin</h1>
          <p className="sidebar-subtitle text-xs uppercase tracking-[0.2em] text-slate-400">
            Management Panel
          </p>
        </div>

        <nav className="sidebar-nav flex flex-col gap-2 px-4 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive ? "active bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer mt-auto border-t border-slate-100 px-4 py-4">
          <div className="user-info flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
            <div className="user-avatar flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {avatarLetter}
            </div>
            <div className="user-meta">
              <p className="user-name text-sm font-semibold text-slate-900">{displayName}</p>
              <p className="user-email text-xs text-slate-500">{displayEmail}</p>
            </div>
            <button
              className="avatar-logout-btn ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
              onClick={logout}
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content flex-1 bg-slate-50">{children}</main>
    </div>
  );
};

export default Sidebar;
