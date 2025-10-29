import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/auth/author-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
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

  return (
    <div className="form-page">
      <Card className="form-card" elevation={8}>
        <CardHeader
          title={
            <Typography variant="h4" className="form-title">
              Author Application
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary" className="form-subtitle">
              Fill in the details below. We'll review your application within 24 hours.
            </Typography>
          }
        />

        <CardContent>
          <form onSubmit={handleSubmit} className="form-container">
            <TextField
              fullWidth
              required
              label="Full Name"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              multiline
              minRows={1}
              variant="outlined"
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
              multiline
              minRows={1}
              
              variant="outlined"
            />

            <TextField
              fullWidth
              required
              label="Brief Bio"
              name="bio"
              placeholder="Tell us about your writing experience and background (100–200 words)"
              value={formData.bio}
              onChange={handleChange}
              multiline
              minRows={4}
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Topics of Interest"
              name="topics"
              placeholder="Technology, Business, Health"
              value={formData.topics}
              onChange={handleChange}
              multiline
              minRows={1}
              variant="outlined"
              helperText="Separate multiple topics with commas"
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
            />

            <CardActions className="submit-btn-wrapper">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                size="large"
                startIcon={
                  isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />
                }
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
