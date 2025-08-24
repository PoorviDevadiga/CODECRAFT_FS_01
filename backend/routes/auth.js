const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

// ✅ Import User model
const User = require(path.join(__dirname, "../models/User"));

// ✅ Import middleware
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// ✅ Signup Route
// ===============================
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

// ===============================
// ✅ Login Route
// ===============================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            "secretKey", // ⚠️ later move to .env
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});

// ===============================
// ✅ Protected Routes
// ===============================
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Welcome to your profile!", user: req.user });
});

router.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: "You have accessed a protected route 🎉", user: req.user });
});

// ===============================
module.exports = router; 