const Comment = require("../models/Comment.modal");
const Whiteboard = require("../models/Whiteboard.modal");
const { createNotification } = require("../utils/notificationHelper");

const { emitNewComment } = require("./../config/socket"); // Import the socket emit function

exports.postComment = async (req, res) => {
  const { drawingId, commentText, user } = req.body;

  if (!drawingId || !commentText || !user) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const drawing = await Whiteboard.findById(drawingId).select("drawingTitle");
    if (!drawing) {
      return res.status(404).json({ message: "Drawing not found." });
    }

    const { drawingTitle } = drawing; // Extract drawing title

    const newComment = new Comment({
      drawingId,
      commentText,
      user,
    });

    const savedComment = await newComment.save();

    // Create a notification for the new comment
    await createNotification({
      userId: user,
      code: "new_comment",
      redirectUrl: `/drawing/${drawingId}`,
      drawingTitle,
    });

    // Emit the new comment to all connected clients
    emitNewComment(savedComment);

    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error saving comment:", error);
    res.status(500).json({ message: "Failed to save comment." });
  }
};

// Get all comments for a specific clg
exports.getAllComments = async (req, res) => {
  const drawingId = req.params.id;

  try {
    // Fetch all comments related to the drawing and populate the 'user' field
    const comments = await Comment.find({ drawingId }).sort({ createdAt: -1 });

    if (!comments.length) {
      return res
        .status(404)
        .json({ message: "No comments found for this drawing." });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments." });
  }
};
