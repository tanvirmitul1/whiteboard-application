const Notification = require("../models/Notification.modal");

// Create a new notification
const createNotification = async (req, res) => {
  const { message, userId } = req.body;

  try {
    const notification = new Notification({ message, userId });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error });
  }
};

const getNotificationsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ userId });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};
const getAllNotification = async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error); // Log the error for debugging
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

const updateNotification = async (req, res) => {
  const notificationId = req.params.id;
  const { read } = req.body;

  try {
    // Find the notification by ID and update its read status
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: read },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createNotification,
  getNotificationsByUser,
  getAllNotification,
  updateNotification,
};
