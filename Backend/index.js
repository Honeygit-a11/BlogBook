const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const blogrouter = require("./Routes/blogrouter");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


// Routes
app.use("/api/auth",authRoutes);
app.use("/api/blogs",blogrouter)

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() =>{ console.log("MongoDB Connected");
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
  .catch(err => console.log(" DB Error:", err));
// Start server
const PORT = process.env.PORT;
