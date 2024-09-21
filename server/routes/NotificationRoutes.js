const express = require("express");
const {
  createNotification,
  getNotificationsByUser,
  getAllNotification,
  updateNotification,
} = require("../controllers/notificationController");
const router = express.Router();

// Create a new notification
router.post("/", createNotification);
router.get("/all-notifications", getAllNotification);

// Get notifications by userId
router.get("/:userId", getNotificationsByUser);
router.put("/:id", updateNotification);

module.exports = router;
