import React, { useContext, useState } from "react";
import "./Header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { AuthContext } from "../context/Authcontext";

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Header = ({ searchTerm = "", onSearchChange }) => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
  const initials = getInitials(user?.username || user?.name);
  const isAvatarMenuOpen = Boolean(avatarAnchorEl);
  const primaryAction =
    user && (user.role === "author" || user.role === "admin")
      ? { label: "Write", to: "/write" }
      : { label: "Become an author", to: "/author" };

  return (
    <div className="site-header">
      <header className="header">
        <div className="container header-inner">
          <Link to="/dashboard" className="logo">
            BlogBook
          </Link>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>

          <nav
            className={`nav ${isMenuOpen ? "open" : ""}`}
          >
            <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/category" onClick={() => setIsMenuOpen(false)}>
              Categories
            </NavLink>
            <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
              About
            </NavLink>
            <NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </NavLink>
          </nav>

          <div className={`actions-section ${isMenuOpen ? "open" : ""}`}>
            <div className="search-bar1">
              <input
                type="search"
                placeholder="Search stories, authors..."
                value={searchTerm}
                onChange={(event) => onSearchChange?.(event.target.value)}
                className="search-input"
              />
              <span className="sr-only">Search</span>
            </div>

            {isAuthenticated && (
              <Link
                to={primaryAction.to}
                className="primary-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                {primaryAction.label}
              </Link>
            )}

            <IconButton
              aria-label="User Profile"
              onClick={(event) => {
                setIsMenuOpen(false);
                setAvatarAnchorEl((prev) => (prev ? null : event.currentTarget));
              }}
              size="large"
            >
              <Avatar sx={{ bgcolor: "#191919", width: 36, height: 36, fontSize: "0.85rem" }}>
                {initials}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={avatarAnchorEl}
              open={isAvatarMenuOpen}
              onClose={() => setAvatarAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  setAvatarAnchorEl(null);
                  navigate("/profile");
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAvatarAnchorEl(null);
                  logout();
                }}
              >
                Sign out
              </MenuItem>
            </Menu>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
