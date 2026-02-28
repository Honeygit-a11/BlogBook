import React, { useState, useContext } from "react";
import "../../style/Signup.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signup successful! Please login.");
        login(data.token, data.user); // Use context login with user data
        navigate("/dashboard");
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container min-h-screen bg-slate-50 px-4 py-10">
      <div className="auth-shell mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-[1.1fr_1fr]">
        <aside className="auth-panel flex flex-col gap-6 bg-slate-900 px-8 py-10 text-white">
          <div className="brand flex items-center gap-3">
            <div className="brand-mark flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold">
              BB
            </div>
            <div className="brand-text flex flex-col">
              <span className="brand-name text-lg font-semibold">BlogBook</span>
              <span className="brand-tagline text-xs text-slate-300">Write. Publish. Grow.</span>
            </div>
          </div>

          <h1 className="panel-title text-3xl font-semibold">Create your writer profile</h1>
          <p className="panel-subtitle text-sm text-slate-300">
            Start publishing today. Get access to tools that help your stories reach more readers.
          </p>

          <div className="panel-stats grid gap-4 text-xs text-slate-300">
            <div>
              <span className="stat-value text-lg font-semibold text-white">24h</span>
              <span className="stat-label">Author review time</span>
            </div>
            <div>
              <span className="stat-value text-lg font-semibold text-white">Weekly</span>
              <span className="stat-label">Editorial highlights</span>
            </div>
            <div>
              <span className="stat-value text-lg font-semibold text-white">Global</span>
              <span className="stat-label">Reader community</span>
            </div>
          </div>
        </aside>

        <div className="auth-box px-8 py-10">
          <div className="auth-header mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">Create account</h2>
            <p className="text-sm text-slate-500">Join the community and start sharing your ideas.</p>
          </div>

          <div className="auth-tabs mb-6 flex gap-3">
            <Link to="/" className="tab-btn rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
              <i className="fa fa-sign-in-alt"></i> Login
            </Link>
            <button className="active rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
              <i className="fa fa-user-plus"></i> Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handleChange}
              className="mb-4 mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            />

            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="mb-4 mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            />

            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Password</label>
            <div className="password-box relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="mb-4 mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
              <i
                className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                onClick={togglePassword}
              ></i>
            </div>

            <button type="submit" className="signup-btn inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-xs font-semibold text-white">
              <i className="fa fa-user-plus"></i> Sign Up
            </button>
          </form>

          {message && <p className="response-message mt-4 text-sm text-slate-600">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Signup;
