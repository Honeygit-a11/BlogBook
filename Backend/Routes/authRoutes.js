const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { verifyToken } = require('../middleware/authmiddleware');

//sign up
router.post("/signup", async (req, res) => {
    try{
        // Accept either `name` (from frontend) or `username` and normalize to `username`
        const { name, username: reqUsername, email, password } = req.body;
        const username = reqUsername || name; // frontend uses `name`

        // Basic server-side validation with clear messages
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Missing required fields: username (or name), email and password are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        
        // Create JWT token for the newly registered user
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        // Return success message, token and basic user info (no password)
        res.status(201).json({ 
            message: "User created successfully",
            token,
            user: { id: newUser._id, username: newUser.username, email: newUser.email }
        });
    } catch (error) {
        // If Mongoose validation error, return its details for easier debugging
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message).join(', ');
            return res.status(400).json({ message: `Validation error: ${messages}` });
        }
        res.status(500).json({ message: "Server error: " + error.message });
    }
});

// login Api
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// export router

// Protected route to get current user's info
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
