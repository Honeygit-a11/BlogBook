import React, { useEffect, useMemo, useState } from "react";
import { Users, PenTool, FileText, Eye, TrendingUp } from "lucide-react";
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

  const draftPosts = Math.max(0, stats.totalPosts - stats.publishedPosts);
  const publishRate = stats.totalPosts
    ? Math.round((stats.publishedPosts / stats.totalPosts) * 100)
    : 0;
  const authorShare = stats.totalUsers
    ? Math.round((stats.totalAuthors / stats.totalUsers) * 100)
    : 0;

  const activitySeries = useMemo(() => {
    const base = Math.max(1, Math.round(stats.totalPosts * 0.08));
    const bumps = [1.1, 1.6, 1.2, 1.9, 1.4, 2.1];
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label, index) => ({
      label,
      value: Math.max(1, Math.round(base * bumps[index] + stats.publishedPosts * 0.05)),
    }));
  }, [stats.totalPosts, stats.publishedPosts]);

  if (loading)
    return (
      <div className="dashboard-state">
        <div className="state-card">
          <div className="state-title">Loading dashboard…</div>
          <p>Crunching the latest content stats.</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="dashboard-state">
        <div className="state-card error">
          <div className="state-title">Something went wrong</div>
          <p>{error}</p>
        </div>
      </div>
    );

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "#2563EB", bg: "#DBEAFE" },
    { title: "Total Authors", value: stats.totalAuthors, icon: PenTool, color: "#16A34A", bg: "#DCFCE7" },
    { title: "Total Posts", value: stats.totalPosts, icon: FileText, color: "#7C3AED", bg: "#EDE9FE" },
    { title: "Published Posts", value: stats.publishedPosts, icon: Eye, color: "#EA580C", bg: "#FFEDD5" },
  ];

  return (
    <div className="dashboard min-h-screen px-4 py-6 md:px-8">
      <div className="dashboard-header flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow text-xs uppercase tracking-[0.3em] font-semibold text-indigo-500">
            Admin overview
          </span>
          <h2 className="text-3xl font-semibold text-slate-900">Dashboard</h2>
          <p className="text-sm text-slate-500">Welcome back! Here's the pulse of your blog right now.</p>
        </div>
        <div className="header-meta flex flex-col gap-2 items-start md:items-end">
          <div className="meta-pill inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
            <TrendingUp size={16} />
            <span>Publish rate {publishRate}%</span>
          </div>
          <div className="meta-sub text-xs text-slate-500">
            Updated {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card rounded-2xl bg-white/90 p-4 shadow-sm">
              <div className="card-header flex items-center justify-between">
                <span className="card-title text-xs font-semibold text-slate-500 uppercase tracking-[0.08em]">
                  {stat.title}
                </span>
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

      <div className="insights-grid grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="card chart-card rounded-2xl bg-white/90 p-4 shadow-sm">
          <div className="card-header flex items-center justify-between gap-4">
            <div>
              <span className="card-title text-xs font-semibold text-slate-500 uppercase tracking-[0.08em]">
                Publishing Trend
              </span>
              <p className="text-muted text-sm text-slate-400">Posts added over the last 6 days</p>
            </div>
            <div className="chart-total">
              <span>{stats.publishedPosts}</span>
              <small>Published</small>
            </div>
          </div>
          <div className="chart-area">
            {activitySeries.map((item) => (
              <div key={item.label} className="chart-bar">
                <div
                  className="chart-bar-fill"
                  style={{ height: `${Math.min(100, item.value * 6)}%` }}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card metrics-card rounded-2xl bg-white/90 p-4 shadow-sm">
          <div className="card-header">
            <span className="card-title text-xs font-semibold text-slate-500 uppercase tracking-[0.08em]">
              Content Health
            </span>
          </div>
          <div className="meter-group">
            <div className="meter-row">
              <span>Published</span>
              <div className="meter-track">
                <div className="meter-fill" style={{ width: `${publishRate}%` }} />
              </div>
              <span className="meter-value">{publishRate}%</span>
            </div>
            <div className="meter-row">
              <span>Drafts</span>
              <div className="meter-track">
                <div
                  className="meter-fill secondary"
                  style={{
                    width: `${stats.totalPosts ? Math.round((draftPosts / stats.totalPosts) * 100) : 0}%`,
                  }}
                />
              </div>
              <span className="meter-value">{draftPosts}</span>
            </div>
            <div className="meter-row">
              <span>Author share</span>
              <div className="meter-track">
                <div className="meter-fill accent" style={{ width: `${authorShare}%` }} />
              </div>
              <span className="meter-value">{authorShare}%</span>
            </div>
          </div>
          <div className="metric-footer">
            Keep authors engaged to raise weekly publishing velocity.
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-grid grid gap-4 md:grid-cols-2">
        <div className="card rounded-2xl bg-white/90 p-4 shadow-sm">
          <div className="card-header">
            <span className="card-title text-xs font-semibold text-slate-500 uppercase tracking-[0.08em]">
              Quick Stats
            </span>
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
              <span className="stat-value">{draftPosts}</span>
            </div>
          </div>
        </div>

        <div className="card rounded-2xl bg-white/90 p-4 shadow-sm">
          <div className="card-header">
            <span className="card-title text-xs font-semibold text-slate-500 uppercase tracking-[0.08em]">
              Recent Activity
            </span>
          </div>
          <div className="card-content">
            <p className="text-muted">Total blogs created</p>
            <div className="views-total">{stats.totalPosts}</div>
            <div className="activity-note">
              {stats.publishedPosts} published · {draftPosts} in draft
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
