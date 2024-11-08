// routes/auth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User"); // Mongoose User model
const router = express.Router();

// GET Signup Page
router.get("/signup", (req, res) => res.render("signup"));

// POST Signup Handler
router.post("/signup", async (req, res) => {
  const { name, email, password, role, security } = req.body;

  try {
    // 1. Check if User Already Exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .render("signup", { error: "User already exists with this email." });
    }

    // 2. Password Strength Validation
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).render("signup", {
        error: "Password too weak. Please choose a stronger password.",
      });
    }

    // 3. Admin Security Question Validation
    if (role === "admin") {
      const predefinedAnswer = "Sayan69"; // Replace with your actual predefined answer
      if (security !== predefinedAnswer) {
        return res.status(400).render("signup", {
          error: "Incorrect answer to the security question.",
        });
      }
    }

    // Hash the Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create New User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET Login Page
router.get("/login", (req, res) => res.render("login"));

// POST Login Handler
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: false, // Set to true if using flash messages
  })(req, res, next);
});

// Logout Handler
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/login");
  });
});

module.exports = router;
