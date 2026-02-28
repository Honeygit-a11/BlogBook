import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "../../style/AuthorRequest.css";

export default function AuthorRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bio: "",
    topics: "",
    portfolio: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.bio) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/auth/author-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Application submitted successfully!");
        setFormData({
          fullName: "",
          email: "",
          bio: "",
          topics: "",
          portfolio: "",
        });
      } else {
        alert(data.message || "Failed to submit application");
      }
    } catch (error) {
      alert("An error occurred while submitting the application");
      console.error(error);
    }
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const inputSx = {
    "& .MuiInputLabel-root": {
      fontSize: "1.14rem",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      backgroundColor: "#ffffff",
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "1.14rem",
      padding: "21px 18px",
    },
    "& .MuiInputBase-inputMultiline": {
      fontSize: "1.14rem",
      lineHeight: 1.8,
      padding: "18px",
    },
    "& .MuiOutlinedInput-input::placeholder": {
      textAlign: "center",
      opacity: 1,
    },
    "& .MuiInputBase-inputMultiline::placeholder": {
      textAlign: "center",
      opacity: 1,
    },
  };

  return (
    <div className="author-page bg-slate-50 text-slate-900">
      <section className="author-hero">
        <div className="author-wrap">
          <p className="author-kicker">Creator Program</p>
          <h1>Apply to become a BlogBook author</h1>
          <p className="author-lead">
            Publish your ideas for a wider audience. We review every application for clarity,
            consistency, and topic fit.
          </p>
          <div className="author-badges">
            <span>24h review</span>
            <span>Editorial feedback</span>
            <span>Featured opportunities</span>
          </div>
        </div>
      </section>

      <section className="author-form-area">
        <div className="author-wrap">
          <div className="author-form-shell">
            <div className="author-form-card">
              <div className="author-form-head">
                <h2>Author Application</h2>
                <p>Complete the form below. Required fields are marked.</p>
              </div>

              <form onSubmit={handleSubmit} className="author-form">
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  variant="outlined"
                  size="medium"
                  sx={inputSx}
                />

                <TextField
                  fullWidth
                  required
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  size="medium"
                  sx={inputSx}
                />

                <TextField
                  fullWidth
                  required
                  label="Brief Bio"
                  name="bio"
                  placeholder="Tell us about your writing experience and background (100-200 words)"
                  value={formData.bio}
                  onChange={handleChange}
                  multiline
                  minRows={10}
                  variant="outlined"
                  sx={inputSx}
                />

                <TextField
                  fullWidth
                  label="Topics of Interest"
                  name="topics"
                  placeholder="Technology, Business, Health"
                  value={formData.topics}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="Separate multiple topics with commas"
                  size="medium"
                  sx={inputSx}
                />

                <TextField
                  fullWidth
                  label="Portfolio / Writing Samples"
                  name="portfolio"
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolio}
                  onChange={handleChange}
                  variant="outlined"
                  size="medium"
                  sx={inputSx}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  size="large"
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  sx={{
                    borderRadius: "14px",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    py: 1.8,
                    backgroundColor: "#191919",
                    "&:hover": { backgroundColor: "#111111" },
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
