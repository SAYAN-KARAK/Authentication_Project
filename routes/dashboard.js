// routes/dashboard.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Middleware to check if user is authenticated and is admin
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/login");
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  res.redirect("/dashboard");
};

// Admin dashboard to view user feedback, visit counts, and ratings
router.get("/admin", isAuthenticated, isAdmin, async (req, res) => {
  const users = await User.find({}, "name email role visitCount feedback");

  // Calculate ratings based on visit count or contributions
  users.forEach((user) => {
    if (user.visitCount >= 20) {
      user.rating = 5;
    } else if (user.visitCount >= 15) {
      user.rating = 4;
    } else if (user.visitCount >= 10) {
      user.rating = 3;
    } else if (user.visitCount >= 5) {
      user.rating = 2;
    } else {
      user.rating = 1;
    }
  });

  res.render("admin_dashboard", { users });
});

// Increment visit count each time user accesses dashboard
router.get("/", isAuthenticated, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { visitCount: 1 },
  });
  const user = await User.findById(req.user._id);
  let suggestions = [];

  if (user.role === "admin") {
    suggestions = await User.find(
      { "feedback.0": { $exists: true } },
      "name feedback"
    );
  }

  res.render("dashboard", { user, suggestions });
});

// Route to submit feedback
router.post("/suggest", isAuthenticated, async (req, res) => {
  const { suggestion } = req.body;

  if (!suggestion) {
    return res.redirect("/dashboard");
  }

  await User.findByIdAndUpdate(req.user._id, {
    $push: { feedback: { text: suggestion } },
  });

  res.redirect("/dashboard");
});

module.exports = router;
