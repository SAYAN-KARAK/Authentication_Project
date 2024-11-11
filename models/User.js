// models/User.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profilePicture: { type: String, default: "/images/default-profile.png" },
  visitCount: { type: Number, default: 0 },
  contributionScore: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  feedback: [feedbackSchema], // Array to store user feedback
});

const User = mongoose.model("User", userSchema);
module.exports = User;
