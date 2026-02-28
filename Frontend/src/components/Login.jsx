import React, { useState, useContext } from "react";
import "../../style/Login.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const togglePassword = () =>{
    setShowPassword(!showPassword)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful!");
        login(data.token, data.user); // Use context login with user data
        // Redirect based on role
        if (data.user.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setMessage(data.message || "Invalid credentials");
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

          <h1 className="panel-title text-3xl font-semibold">Welcome back</h1>
          <p className="panel-subtitle text-sm text-slate-300">
            Pick up where you left off and share your next story with the community.
          </p>

          <div className="panel-stats grid gap-4 text-xs text-slate-300">
            <div>
              <span className="stat-value text-lg font-semibold text-white">50K+</span>
              <span className="stat-label">Active writers</span>
            </div>
            <div>
              <span className="stat-value text-lg font-semibold text-white">1M+</span>
              <span className="stat-label">Monthly readers</span>
            </div>
            <div>
              <span className="stat-value text-lg font-semibold text-white">100K+</span>
              <span className="stat-label">Stories published</span>
            </div>
          </div>
        </aside>

        <div className="auth-box px-8 py-10">
          <div className="auth-header mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
            <p className="text-sm text-slate-500">Use your account credentials to continue.</p>
          </div>

          <div className="auth-tabs mb-6 flex gap-3">
            <button className="active rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
              <i className="fa fa-sign-in-alt"></i> Login
            </button>
            <Link to="/signup" className="tab-btn rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
              <i className="fa fa-user-plus"></i> Sign Up
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="mb-4 mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
              <i
                className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                onClick={togglePassword}
              ></i>
            </div>

            <button type="submit" className="signin-btn inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-xs font-semibold text-white">
              <i className="fa fa-sign-in-alt"></i> Sign In
            </button>
          </form>

          {message && <p className="response-message mt-4 text-sm text-slate-600">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
