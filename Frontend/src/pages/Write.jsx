import React, { useState } from "react";
import "../../style/Write.css";
import axios from "axios";

const Write = () => {
  const [blog, setBlog] = useState({
    title: "",
    category: "",
    image: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBlog({ ...blog, image: reader.result, imageFile: file });
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    if (window.confirm("Start fresh and clear all fields?")) {
      setBlog({ title: "", category: "", image: "", content: "", imageFile: null });
    }
  };

  const handleSubmit = async () => {
    if (!blog.title || !blog.category || !blog.content) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      // Get token from localStorage (you can adjust if stored elsewhere)
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a blog!");
        return;
      }

      const formData = new FormData();
      formData.append('title', blog.title);
      formData.append('category', blog.category);
      formData.append('content', blog.content);
      if (blog.imageFile) {
        formData.append('image', blog.imageFile);
      } else {
        formData.append('image', blog.image); // URL
      }

      const url = "http://localhost:4000/api/blogs/create";
      const resp = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = resp.data;
      // Success response from backend should be 201 and include the blog
      alert("✅ Blog created successfully!");
      setBlog({ title: "", category: "", image: "", content: "", imageFile: null });
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("❌ Something went wrong!");
    }
  };

  return (
    <div className="write-page">
      {/* Header */}
      <header className="write-header">
        <div className="header-left">
          <div className="icon-box">🖋️</div>
          <div>
            <h1>Create Blog Post</h1>
            <p>✨ Write and share your story</p>
          </div>
        </div>
        <button className="clear-btn" onClick={handleClear}>
          🧹 Start Fresh
        </button>
      </header>

      {/* Main Card */}
      <div className="card">
        <div className="card-header">
          <h2>📝 Write Your Story</h2>
          <button className="create-btn" onClick={handleSubmit}>
            🚀 Create Post
          </button>
        </div>

        <div className="card-body">
          {/* Blog Title */}
          <div className="form-group">
            <label>🅣 Blog Title</label>
            <input
              type="text"
              name="title"
              value={blog.title}
              onChange={handleChange}
              placeholder="Give your blog an amazing title..."
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>🏷️ Category</label>
            <select
              name="category"
              value={blog.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Fashion">Fashion</option>
              <option value="Education">Education</option>
            </select>
          </div>

          {/* Featured Image */}
          <div className="form-group">
            <label>🖼️ Featured Image</label>
            <input
              type="text"
              name="image"
              value={blog.image}
              onChange={handleChange}
              placeholder="Enter image URL or upload below..."
            />
            <div className="upload-box">
              <input
                type="file"
                accept="image/*"
                id="upload"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <button onClick={() => document.getElementById("upload").click()}>
                ⬆️ Upload Image
              </button>
            </div>
            {blog.image && (
              <img src={blog.image} alt="preview" className="preview-img" />
            )}
          </div>

          {/* Content */}
          <div className="form-group">
            <label>✍️ Blog Content</label>
            <textarea
              name="content"
              value={blog.content}
              onChange={handleChange}
              placeholder="Start writing your story here..."
              rows="10"
            ></textarea>
          </div>

          <div className="tip-box">
            <strong>💡 Pro Tip:</strong> Write from the heart — your audience
            will feel your words.
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>🌍 Create amazing content and share it with the world</p>
      </footer>
    </div>
  );
};

export default Write;
