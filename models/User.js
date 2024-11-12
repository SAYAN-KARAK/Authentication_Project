const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" },
  visitCount: { type: Number, default: 0 },
  feedback: [
    {
      text: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
