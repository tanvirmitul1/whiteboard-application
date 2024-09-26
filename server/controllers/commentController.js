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

    const { drawingTitle } = drawing;

    const newComment = new Comment({
      drawingId,
      commentText,
      user,
    });

    // Save the comment
    let savedComment = await newComment.save();

    // Populate the user details (including the username)
    savedComment = await savedComment.populate("user", "username");

    console.log({ savedComment });

    // Create a notification for the new comment
    await createNotification({
      userId: user,
      code: "new_comment",
      redirectUrl: `/drawing/${drawingId}`,
      drawingTitle,
    });
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
    const comments = await Comment.find({ drawingId })
      .sort({ createdAt: -1 })
      .populate("user", "username");

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
