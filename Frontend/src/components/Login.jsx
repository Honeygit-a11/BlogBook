import React, { useState } from "react";
import "../../style/Login.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
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
        localStorage.setItem("token", data.token); // optional
        navigate("/dashboard"); // redirect
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome</h2>
        <p>Sign in to your account or create a new one</p>

        {/* Tabs */}
        <div className="login-tabs">
          <button className="active">
            <i className="fa fa-sign-in-alt"></i> Login
          </button>
          <Link to="/signup" className="tab-btn">
            <i className="fa fa-user-plus"></i> Sign Up
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Password</label>
          <div className="password-box">
            <input
              type={showPassword ? "text":"password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
             <i
              className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              onClick={togglePassword}
            ></i>
          </div>

          <button type="submit" className="signin-btn">
            <i className="fa fa-sign-in-alt"></i> Sign In
          </button>
        </form>

        {message && <p className="response-message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
