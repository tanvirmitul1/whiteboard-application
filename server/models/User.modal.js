const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "User"], required: true },
  imageUrl: { type: String, required: false }, // Changed to optional
  deleteUrl: { type: String, required: false }, // Changed to optional
});

const User = mongoose.model("User", userSchema);
module.exports = User;
