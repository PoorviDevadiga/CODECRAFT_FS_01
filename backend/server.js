// ------------------ Required Packages ------------------
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // <-- Added for MongoDB connection
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------ Middleware ------------------
app.use(cors());
app.use(express.json());

//Routes
const authRoutes = require( "./routes/auth");
app.use("/api/auth", authRoutes);

// ------------------ MongoDB Connection ------------------
mongoose.connect("mongodb://localhost:27017/authDB", { // <-- Added this block
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------ Test Route ------------------
app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
});

// ------------------ Start Server ------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});