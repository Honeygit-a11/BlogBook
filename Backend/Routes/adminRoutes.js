const express =  require("express");
const router = express.Router();
const User = require("../models/User");
const AuthorRequest = require("../models/AuthorRequest");
const Blog = require("../models/Blog");
const bcrypt = require("bcryptjs");
const {verifyToken,isAdmin} = require("../middleware/authmiddleware");

router.use(verifyToken,isAdmin);
// admin cann get all the user
router.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({users});
    } catch (error) {
        res.status(500).json({ message:"error fetching users", error: error.message });
    }
});

// create a user (admin only)
router.post("/users", async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Missing required fields: username, email, password" });
        }
        const allowedRoles = ["user", "admin", "author"];
        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || "user"
        });
        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

// update a user (admin only)
router.put("/users/:id", async (req, res) => {
    try {
        const { username, email, role, password } = req.body;
        const allowedRoles = ["user", "admin", "author"];
        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (username !== undefined) user.username = username;
        if (email !== undefined) user.email = email;
        if (role !== undefined) user.role = role;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.json({
            message: "User updated successfully",
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
});

// delete a user it can only deletd by admin
router.delete("/users/:id", async (req, res)=>{
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if(!deletedUser){
            return res.status(404).json({ message:"user not found"});

        }
        res.json({message:"User deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Error deleting user", error:error.message});
    }
});

// Get all pending author requests
router.get("/author-requests", async (req, res) => {
    try {
        const requests = await AuthorRequest.find({ status: 'pending' }).populate('userId', 'username email');
        res.json({ requests });
    } catch (error) {
        res.status(500).json({ message: "Error fetching author requests", error: error.message });
    }
});

// Approve author request
router.put("/author-requests/:id/approve", async (req, res) => {
    try {
        const request = await AuthorRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "Author request not found" });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: "Request is not pending" });
        }

        // Update user role to 'author'
        await User.findByIdAndUpdate(request.userId, { role: 'author' });

        // Update request status
        request.status = 'approved';
        request.reviewedAt = new Date();
        request.reviewedBy = req.user.id;
        await request.save();

        res.json({ message: "Author request approved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error approving author request", error: error.message });
    }
});

// Get dashboard stats
router.get("/stats", async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAuthors = await User.countDocuments({ role: 'author' });
        const totalBlogs = await Blog.countDocuments();
        // Assuming all blogs are published since no status field; if drafts exist, add status to Blog model
        const publishedBlogs = totalBlogs;

        res.json({
            totalUsers,
            totalAuthors,
            totalBlogs,
            publishedBlogs
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats", error: error.message });
    }
});

// Get all posts for admin
router.get("/posts", async (req, res) => {
    try {
        const posts = await Blog.find().populate('author', 'username email').sort({ createdAt: -1 });
        res.json({ posts });
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
});

// Get all authors
router.get("/authors", async (req, res) => {
    try {
        const authors = await User.find({ role: 'author' }).select("-password");
        res.json({ authors });
    } catch (error) {
        res.status(500).json({ message: "Error fetching authors", error: error.message });
    }
});

// Convert author to user
router.put("/authors/:id/convert-to-user", async (req, res) => {
    try {
        const author = await User.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }
        if (author.role !== 'author') {
            return res.status(400).json({ message: "User is not an author" });
        }
        author.role = 'user';
        await author.save();
        res.json({ message: "Author converted to user successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error converting author to user", error: error.message });
    }
});

module.exports = router;
