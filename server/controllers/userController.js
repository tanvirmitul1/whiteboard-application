const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.modal");
const { validationResult } = require("express-validator");
const multer = require("multer");
const Image = require("../models/Image.modal");
const uploadImageToImgBB = require("../utils/imageUploadHelper");
// Configure Multer for file uploads
const storage = multer.memoryStorage();
exports.upload = multer({ storage });
exports.createUser = async (req, res) => {
  // Run validation checks
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password, role } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    // Respond with newly created user data
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const image = await Image.find({ userId: user._id });
    const userWithImages = { ...user.toObject(), image };
    console.log({ user });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ user: userWithImages, token });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, userName } = req.body;

    const user = await User.findOne({ username: userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("image");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete User by ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user", error });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    const { userId } = req.body;
    const fileBuffer = req.file.buffer;

    // Use the helper function to upload the image and save the info to MongoDB
    const imageDetails = await uploadImageToImgBB(fileBuffer, userId);

    // Send response to client with image details
    res.status(201).json({
      message: "Image uploaded successfully!",
      imageUrl: imageDetails.imageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
