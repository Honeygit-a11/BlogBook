import React, { useEffect, useState } from "react";
import { Users, PenTool, FileText, Eye } from "lucide-react";
import "./Details.css";

const Details = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAuthors: 0,
    totalPosts: 0,
    publishedPosts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/admin/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
          },
        });
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats({
          totalUsers: data.totalUsers,
          totalAuthors: data.totalAuthors,
          totalPosts: data.totalBlogs,
          publishedPosts: data.publishedBlogs,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
              <span className="stat-value">{stats.totalUsers}</span>
            </div>
            <div className="stat-row">
              <span>Active Authors</span>
              <span className="stat-value">{stats.totalAuthors}</span>
            </div>
            <div className="stat-row">
              <span>Draft Posts</span>
              <span className="stat-value">{stats.totalPosts - stats.publishedPosts}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Activity</span>
          </div>
          <div className="card-content">
            <p className="text-muted">Total blogs created</p>
            <div className="views-total">{stats.totalPosts}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
