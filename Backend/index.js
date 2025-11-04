const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const blogrouter = require("./Routes/blogrouter");
const adminRouter = require("./Routes/adminRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));


// Routes
app.use("/api/auth",authRoutes);
app.use("/api/blogs",blogrouter);
app.use("/api/admin",adminRouter);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() =>{
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(" DB Error:", err));
