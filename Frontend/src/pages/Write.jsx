import React, { useEffect, useRef, useState } from "react";
import "../../style/Write.css";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const AUTOSAVE_DELAY_MS = 800;

const Write = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);
  const navigate = useNavigate();
  const uploadInputRef = useRef(null);
  const contentRef = useRef(null);
  const autosaveTimerRef = useRef(null);

  const [blog, setBlog] = useState({
    title: "",
    category: "",
    image: "",
    content: "",
  });
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const autosaveKey = isEditMode ? `write_draft_edit_${editId}` : "write_draft_new";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBlog((prev) => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const applyTemplate = (prefix = "", suffix = "", placeholder = "text") => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const currentText = blog.content || "";
    const selected = currentText.slice(start, end) || placeholder;
    const updated = `${currentText.slice(0, start)}${prefix}${selected}${suffix}${currentText.slice(end)}`;

    setBlog((prev) => ({ ...prev, content: updated }));
    setTimeout(() => {
      textarea.focus();
      const caretStart = start + prefix.length;
      const caretEnd = caretStart + selected.length;
      textarea.setSelectionRange(caretStart, caretEnd);
    }, 0);
  };

  const applyLinePrefix = (linePrefix) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const currentText = blog.content || "";
    const selected = currentText.slice(start, end) || "your text";
    const updatedSelection = selected
      .split("\n")
      .map((line) => `${linePrefix}${line}`)
      .join("\n");
    const updated = `${currentText.slice(0, start)}${updatedSelection}${currentText.slice(end)}`;

    setBlog((prev) => ({ ...prev, content: updated }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + updatedSelection.length);
    }, 0);
  };

  useEffect(() => {
    const loadBlogForEdit = async () => {
      if (!editId) {
        try {
          const saved = localStorage.getItem(autosaveKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.blog) {
              setBlog(parsed.blog);
              if (parsed.savedAt) {
                setLastSavedAt(parsed.savedAt);
              }
              setSaveState("restored");
            }
          }
        } catch {
          localStorage.removeItem(autosaveKey);
        }
        return;
      }
      setLoadingBlog(true);
      try {
        const response = await axios.get(`http://localhost:4000/api/blogs/${editId}`);
        const data = response.data || {};
        setBlog({
          title: data.title || "",
          category: data.category || "",
          image: data.image || "",
          content: data.content || "",
        });

        const saved = localStorage.getItem(autosaveKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.blog) {
            setBlog(parsed.blog);
            if (parsed.savedAt) {
              setLastSavedAt(parsed.savedAt);
            }
            setSaveState("restored");
          }
        }
      } catch (error) {
        console.error("Error loading blog for edit:", error);
        alert("Unable to load blog for editing.");
        navigate("/profile");
      } finally {
        setLoadingBlog(false);
      }
    };

    loadBlogForEdit();
  }, [autosaveKey, editId, navigate]);

  useEffect(() => {
    if (loadingBlog) return;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      try {
        const payload = {
          blog,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(autosaveKey, JSON.stringify(payload));
        setLastSavedAt(payload.savedAt);
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [autosaveKey, blog, loadingBlog]);

  const handleClear = () => {
    if (window.confirm("Start fresh and clear all fields?")) {
      setBlog({ title: "", category: "", image: "", content: "" });
      localStorage.removeItem(autosaveKey);
      setLastSavedAt(null);
      setSaveState("idle");
    }
  };

  const handleSubmit = async () => {
    if (!blog.title || !blog.category || !blog.image || !blog.content) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a blog!");
        return;
      }
      const localUser = JSON.parse(localStorage.getItem("user") || "null");
      if (!localUser || (localUser.role !== "author" && localUser.role !== "admin")) {
        alert("Only authors or admins can create blogs. Please request author access.");
        return;
      }

      const url = isEditMode
        ? `http://localhost:4000/api/blogs/${editId}`
        : "http://localhost:4000/api/blogs/create";
      const method = isEditMode ? "put" : "post";

      await axios({
        method,
        url,
        data: blog,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert(isEditMode ? "Blog updated successfully!" : "Blog created successfully!");
      localStorage.removeItem(autosaveKey);
      setLastSavedAt(null);
      setSaveState("idle");
      if (isEditMode) {
        navigate("/profile");
      } else {
        setBlog({ title: "", category: "", image: "", content: "" });
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      let message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong!";

      if (error?.response?.status === 413) {
        message = "Image is too large. Please upload a smaller image.";
      }
      if (error?.response?.status === 403) {
        message = "Only authors or admins can create blogs. Please request author access.";
      }

      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingBlog) {
    return (
      <div className="write-page">
        <div className="container">
          <div className="card">
            <div className="card-body">
              <p>Loading blog...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="write-page">
      <div className="container">
        <header className="write-header">
          <div className="header-left">
            <div className="icon-box">Write</div>
            <div>
              <h1>{isEditMode ? "Edit Blog Post" : "Create Blog Post"}</h1>
              <p>{isEditMode ? "Update and republish your story" : "Write and share your story"}</p>
            </div>
          </div>
          <button className="clear-btn" onClick={handleClear} disabled={isSubmitting}>
            Start Fresh
          </button>
        </header>

        <div className="card">
          <div className="card-header">
            <h2>Write Your Story</h2>
            <button className="create-btn" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditMode ? "Update Post" : "Create Post"}
            </button>
          </div>

          <div className="card-body">
            <div className="form-group">
              <label>Blog Title</label>
              <input
                type="text"
                name="title"
                value={blog.title}
                onChange={handleChange}
                placeholder="Give your blog an amazing title..."
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={blog.category} onChange={handleChange}>
                <option value="">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Travel">Travel</option>
                <option value="Food">Food</option>
                <option value="Fashion">Fashion</option>
                <option value="Education">Education</option>
              </select>
            </div>

            <div className="form-group">
              <label>Featured Image</label>
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
                  ref={uploadInputRef}
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <button type="button" onClick={() => uploadInputRef.current?.click()}>
                  Upload Image
                </button>
              </div>
              {blog.image && <img src={blog.image} alt="preview" className="preview-img" />}
            </div>

            <div className="form-group">
              <label>Blog Content</label>
              <div className="editor-toolbar">
                <button type="button" onClick={() => applyTemplate("**", "**", "bold text")}>Bold</button>
                <button type="button" onClick={() => applyTemplate("*", "*", "italic text")}>Italic</button>
                <button type="button" onClick={() => applyLinePrefix("## ")}>H2</button>
                <button type="button" onClick={() => applyLinePrefix("- ")}>List</button>
                <button type="button" onClick={() => applyLinePrefix("> ")}>Quote</button>
                <button type="button" onClick={() => applyTemplate("[", "](https://example.com)", "link text")}>Link</button>
                <button type="button" onClick={() => applyTemplate("`", "`", "code")}>Code</button>
              </div>
              <textarea
                ref={contentRef}
                name="content"
                value={blog.content}
                onChange={handleChange}
                placeholder="Start writing your story here..."
                rows="10"
              ></textarea>
              <div className="editor-meta">
                <span>Words: {(blog.content.trim().match(/\S+/g) || []).length}</span>
                <span>
                  Autosave:{" "}
                  {saveState === "restored"
                    ? "Draft restored"
                    : saveState === "saved" && lastSavedAt
                    ? `Saved at ${new Date(lastSavedAt).toLocaleTimeString()}`
                    : saveState === "error"
                    ? "Failed"
                    : "Waiting..."}
                </span>
              </div>
            </div>

            <div className="tip-box">
              <strong>Pro Tip:</strong> Write from the heart and your audience will feel your words.
            </div>
          </div>
        </div>

        <footer className="footer">
          <p>Create amazing content and share it with the world</p>
        </footer>
      </div>
    </div>
  );
};

export default Write;
