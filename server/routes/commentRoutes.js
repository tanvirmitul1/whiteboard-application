const express = require("express");
const {
  postComment,
  getAllComments,
} = require("../controllers/commentController");

const router = express.Router();

// Create a new comment
router.post("/store-comments", postComment);

// Get all comments
router.get("/get-all-comments/:id", getAllComments);

module.exports = router;
