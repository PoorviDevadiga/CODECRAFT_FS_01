const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const User = require(path.join(__dirname, "../models/User"));
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// JWT secret (use env if available)
const JWT_SECRET = process.env.JWT_SECRET || "secretKey";

// ---------------------- Signup ----------------------
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Simple validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide username, email and password" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
});

// ---------------------- Login ----------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Provide email and password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    // Return token and some user info (no password)
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
});

// ---------------------- Profile (protected) ----------------------
// Return full user document (without password)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // authMiddleware should set req.user (decoded token) with id
    const userId = req.user && req.user.id ? req.user.id : req.user; // defensive
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Welcome to your profile!", user });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Error fetching profile", error });
  }
});

// Example other protected route
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You have accessed a protected route 🎉", user: req.user });
});

module.exports = router; 
