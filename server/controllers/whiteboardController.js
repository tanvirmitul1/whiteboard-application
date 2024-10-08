const Whiteboard = require("../models/Whiteboard.modal");

const User = require("../models/User.modal");
const { createNotification } = require("../utils/notificationHelper");
const Comment = require("../models/Comment.modal");
const Notification = require("../models/Notification.modal");

const authMiddleware = (req, res, next) => {
  req.user = { _id: "userId", role: "User" };
  next();
};

// Get all drawings for the current user
const getAllDrawings = async (req, res) => {
  const { searchedUser, titleFilter, limit = 6, page = 1 } = req.body;

  try {
    let query = {};

    if (searchedUser) {
      query.user = searchedUser;
    }
    if (titleFilter) {
      query.drawingTitle = { $regex: new RegExp(titleFilter, "i") };
    }

    const limitValue = parseInt(limit);
    const pageValue = parseInt(page);
    const whiteboards = await Whiteboard.find(query)
      .sort({ createdAt: -1 })
      .limit(limitValue)
      .skip((pageValue - 1) * limitValue)
      .populate("user", "username _id");

    const totalDrawings = await Whiteboard.countDocuments(query);
    res.json({
      whiteboards,
      totalPages: Math.ceil(totalDrawings / limitValue),
      currentPage: pageValue,
      totalDrawings,
    });
  } catch (error) {
    console.error("Error fetching drawings:", error);
    res.status(500).json({ message: "Failed to get drawings", error });
  }
};

// Create a new drawing

const createDrawing = async (req, res) => {
  const { drawingTitle, shapeType, shapes, userId } = req.body;

  try {
    // Create and save the drawing
    const whiteboard = new Whiteboard({
      drawingTitle,
      shapeType,
      shapes,
      user: userId,
    });
    console.log({ shapes });

    await whiteboard.save();
    await createNotification({
      userId,
      code: "new_drawing",
      redirectUrl: `/drawing/${whiteboard._id}`,
      drawingTitle: whiteboard.drawingTitle,
    });

    res.status(201).json(whiteboard);
  } catch (error) {
    res.status(500).json({ message: "Failed to create drawing", error });
  }
};

const getDrawingById = async (req, res) => {
  const { id } = req.params;
  try {
    const whiteboard = await Whiteboard.findById(id).populate(
      "user",
      "username _id"
    );
    if (!whiteboard) {
      return res.status(404).json({ message: "Drawing not found" });
    }
    res.json(whiteboard);
  } catch (error) {
    res.status(500).json({ message: "Failed to get drawing", error });
  }
};

// Update a specific drawing by ID
const updateDrawing = async (req, res) => {
  const { id } = req.params;
  const { shapes, drawingTitle, userId } = req.body;

  console.log("req body", req.body);

  try {
    const whiteboard = await Whiteboard.findByIdAndUpdate(
      id,
      { shapes, drawingTitle },
      { new: true }
    );

    if (!whiteboard) {
      return res.status(404).json({ message: "Drawing not found" });
    }
    // Create the notification message
    await createNotification({
      userId,
      code: "update_drawing",
      redirectUrl: `/drawing/${whiteboard._id}`,
      drawingTitle: whiteboard.drawingTitle,
    });

    res.json(whiteboard);
  } catch (error) {
    res.status(500).json({ message: "Failed to update drawing", error });
  }
};

const deleteDrawing = async (req, res) => {
  const { id } = req.params;

  try {
    // First, find the drawing by ID
    const whiteboard = await Whiteboard.findByIdAndDelete(id);

    if (!whiteboard) {
      return res.status(404).json({ message: "Drawing not found" });
    }

    // Delete comments associated with this drawing
    await Comment.deleteMany({ drawingId: id });

    // Delete notifications related to this drawing
    await Notification.deleteMany({ redirectUrl: { $regex: id } });

    res.json({
      message:
        "Drawing and associated comments and notifications deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting drawing:", error);
    res.status(500).json({ message: "Failed to delete drawing", error });
  }
};

const submitReaction = async (req, res) => {
  const { reactionType, userId, whiteboardId } = req.body;

  // Validate the request
  if (!reactionType || !userId || !whiteboardId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find the whiteboard by ID
    const whiteboard = await Whiteboard.findById(whiteboardId);
    if (!whiteboard) {
      return res.status(404).json({ message: "Whiteboard not found" });
    }

    // Check if the reaction type is valid
    if (!(reactionType in whiteboard.reactions)) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    // Find the user's existing reaction
    const existingReactionIndex = whiteboard.reactors.findIndex(
      (reactor) => reactor.userId.toString() === userId
    );

    if (existingReactionIndex !== -1) {
      // Get the previous reaction type
      const previousReaction =
        whiteboard.reactors[existingReactionIndex].reactionType;

      // Update the user's reaction
      whiteboard.reactors[existingReactionIndex].reactionType = reactionType;

      // Decrease the count for the previous reaction
      whiteboard.reactions[previousReaction] -= 1;

      // Increase the count for the new reaction
      whiteboard.reactions[reactionType] += 1;
    } else {
      // If the user hasn't reacted yet, add their reaction
      whiteboard.reactors.push({ userId, reactionType });

      // Increment the reaction count for the new reaction
      whiteboard.reactions[reactionType] += 1;
    }

    // Save the updated whiteboard document
    await whiteboard.save();

    return res.status(200).json(whiteboard);
  } catch (error) {
    console.error("Error submitting reaction:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  authMiddleware,
  getAllDrawings,
  createDrawing,
  getDrawingById,
  updateDrawing,
  deleteDrawing,
  submitReaction,
};
