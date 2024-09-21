const Notification = require("../models/Notification.modal");
const { emitNotification } = require("../config/socket");
const User = require("../models/User.modal");

/**
 * Create and save a notification
 *
 * @param {Object} options - Options for the notification
 * @param {String} options.userId - The ID of the user to notify

 * @param {String} options.code - A unique code to identify the type of notification
 * @param {String} options.redirectUrl - The URL where the notification will lead the user
 */
const createNotification = async ({ ...args }) => {
  const { userId, code, redirectUrl, drawingTitle } = args;
  const { username } = await User.findById(userId).select("username");

  let message = "";

  if (code) {
    if (code === "new_drawing") {
      message = `
        <div style="font-family: Arial, sans-serif;width: 250px; border-radius: 4px; color: #333;">
          <p style="margin: 0; font-size: 14px; font-weight: bold; color: #4caf50;">
            New Drawing Created!
          </p>
          <p style="margin: 2px 0; font-size: 12px; color: #555;">
            <strong style="color: #000;">${drawingTitle}</strong> has been created by 
            <span style="font-weight: 600; color: #2196f3;">${username}</span>.
          </p>
        </div>
      `;
    } else if (code === "update_drawing") {
      message = `
        <div style="font-family: Arial, sans-serif;width: 250px; border-radius: 4px; color: #333;">
          <p style="margin: 0; font-size: 14px; font-weight: bold; color: #4caf50;">
            Drawing Updated!
          </p>
          <p style="margin: 2px 0; font-size: 12px; color: #555;">
            <strong style="color: #000;">${drawingTitle}</strong> has been updated by
            <span style="font-weight: 600; color: #2196f3;">${username}</span>.
          </p>
        </div>
      `;
    }

    console.log({ message });
  }

  try {
    const notification = new Notification({
      user: userId,
      message,
      code,
      redirectUrl,
    });

    await notification.save();
    emitNotification(notification);
    return notification;
  } catch (error) {
    console.error("Failed to create notification", error);
    throw new Error("Notification creation failed");
  }
};

module.exports = { createNotification };
