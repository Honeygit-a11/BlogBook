import React, { useEffect, useState } from "react";
import { Users, PenTool, FileText, Eye } from "lucide-react";
import "./Details.css";
// import { getUsers, getAuthors, getPosts } from "../lib/storage";

const Details = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAuthors: 0,
    totalPosts: 0,
    publishedPosts: 0,
  });
  const [users, setUsers] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Mock data for now, replace with actual API calls later
    const fetchedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const fetchedAuthors = JSON.parse(localStorage.getItem('authors')) || [];
    const fetchedPosts = JSON.parse(localStorage.getItem('posts')) || [];

    setUsers(fetchedUsers);
    setAuthors(fetchedAuthors);
    setPosts(fetchedPosts);

    setStats({
      totalUsers: fetchedUsers.length,
      totalAuthors: fetchedAuthors.length,
      totalPosts: fetchedPosts.length,
      publishedPosts: fetchedPosts.filter((p) => p.status === "published").length,
    });
  }, []);

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "#2563EB", bg: "#DBEAFE" },
    { title: "Total Authors", value: stats.totalAuthors, icon: PenTool, color: "#16A34A", bg: "#DCFCE7" },
    { title: "Total Posts", value: stats.totalPosts, icon: FileText, color: "#7C3AED", bg: "#EDE9FE" },
    { title: "Published Posts", value: stats.publishedPosts, icon: Eye, color: "#EA580C", bg: "#FFEDD5" },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Welcome back! Here's an overview of your blog.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card">
              <div className="card-header">
                <span className="card-title">{stat.title}</span>
                <div className="icon-wrapper" style={{ backgroundColor: stat.bg }}>
                  <Icon size={20} color={stat.color} />
                </div>
              </div>
              <div className="card-content">
                <span className="card-value">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="bottom-grid">
        {/* Quick Stats */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Quick Stats</span>
          </div>
          <div className="card-content quick-stats">
            <div className="stat-row">
              <span>Active Users</span>
              <span className="stat-value">
                {users.filter((u) => u.status === "active").length}
              </span>
            </div>
            <div className="stat-row">
              <span>Active Authors</span>
              <span className="stat-value">
                {authors.filter((a) => a.status === "active").length}
              </span>
            </div>
            <div className="stat-row">
              <span>Draft Posts</span>
              <span className="stat-value">
                {posts.filter((p) => p.status === "draft").length}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Activity</span>
          </div>
          <div className="card-content">
            <p className="text-muted">Total views across all posts</p>
            <div className="views-total">
              {posts
                .reduce((sum, post) => sum + (post.views || 0), 0)
                .toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
