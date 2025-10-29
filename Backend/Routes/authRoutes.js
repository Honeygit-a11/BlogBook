const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuthorRequest = require('../models/AuthorRequest');
const router = express.Router();
const { verifyToken } = require('../middleware/authmiddleware');


const TOKEN_EXPRIRATION = "1h";
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
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn:TOKEN_EXPRIRATION });
        
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
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPRIRATION  });
        res.json({ message: "Login successful", token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
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

// Submit author request
router.post('/author-request', verifyToken, async (req, res) => {
    try {
        const { fullName, email, bio, topics, portfolio } = req.body;
        const userId = req.user.id;

        // Check if user already has a pending or approved request
        const existingRequest = await AuthorRequest.findOne({
            userId,
            status: { $in: ['pending', 'approved'] }
        });
        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending or approved author request' });
        }

        const newRequest = new AuthorRequest({
            userId,
            fullName,
            email,
            bio,
            topics,
            portfolio
        });

        await newRequest.save();
        res.status(201).json({ message: 'Author request submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

module.exports = router;
