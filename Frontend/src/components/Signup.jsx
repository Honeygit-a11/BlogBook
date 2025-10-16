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
    <div className="signup-container">
      <div className="signup-box">
        <h2>Welcome</h2>
        <p>Sign in to your account or create a new one</p>

        {/* Tabs */}
        <div className="signup-tabs">
          <Link to="/login" className="tab-btn">
            <i className="fa fa-sign-in-alt"></i> Login
          </Link>
          <button className="active">
            <i className="fa fa-user-plus"></i> Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />

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

          <button type="submit" className="signup-btn">
            <i className="fa fa-user-plus"></i> Sign Up
          </button>
        </form>

        {message && <p className="response-message">{message}</p>}
      </div>
    </div>
  );
};

export default Signup;
