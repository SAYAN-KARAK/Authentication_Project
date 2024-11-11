// routes/dashboard.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/login");
};

// Route to render the dashboard
router.get("/", isAuthenticated, async (req, res) => {
  const user = await User.findById(req.user._id);
  let suggestions = [];

  // Fetch suggestions only if user is an admin
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
