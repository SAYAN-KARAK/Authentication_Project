const express = require("express");
const { ensureAuthenticated, ensureAdmin } = require("../config/auth");
const User = require("../models/User");
const router = express.Router();

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    User.find().then((users) => res.render("admin_dashboard", { users }));
  } else {
    res.render("dashboard", { user: req.user });
  }
});

module.exports = router;
