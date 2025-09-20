const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    req.session.userId = user._id;
    res.cookie('sid', req.sessionID, { 
        httpOnly: true,
        secure: false, // set to true if using HTTPS
        maxAge: 1000 * 60 * 60 // 1 hour
    });
    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Đăng xuất
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Logout failed" });

    res.clearCookie("sid");
    res.clearCookie("connect.sid");
    
    res.json({ message: "Logged out successfully" });
  });
});

// Route kiểm tra login
router.get("/profile", async(req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not logged in" });
  }
  const user = await User.findById(req.session.userId).select("-password");
    res.json({ user });
});

module.exports = router;
