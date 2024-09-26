const mongoose = require("mongoose");

const whiteboardSchema = new mongoose.Schema(
  {
    drawingTitle: { type: String, required: true },
    shapeType: {
      type: String,
      enum: ["line", "circle", "rectangle", "text", "pen"],
      required: true,
    },
    shapes: [
      {
        type: {
          type: String,
          enum: ["line", "circle", "rectangle", "text", "pen"],
          required: true,
        },
        // Start and end coordinates for lines and rectangles
        start: {
          x: {
            type: Number,
            required: function () {
              return this.type === "line" || this.type === "rectangle";
            },
          },
          y: {
            type: Number,
            required: function () {
              return this.type === "line" || this.type === "rectangle";
            },
          },
        },
        end: {
          x: {
            type: Number,
            required: function () {
              return this.type === "line" || this.type === "rectangle";
            },
          },
          y: {
            type: Number,
            required: function () {
              return this.type === "line" || this.type === "rectangle";
            },
          },
        },
        // Path for pen drawings
        path: [
          {
            x: {
              type: Number,
              required: function () {
                return this.type === "pen";
              },
            },
            y: {
              type: Number,
              required: function () {
                return this.type === "pen";
              },
            },
          },
        ],
        // Text-specific fields
        text: {
          type: String,
          required: function () {
            return this.type === "text"; // Required only for text type
          },
        },
        position: {
          x: {
            type: Number,
            required: function () {
              return this.type === "text"; // Required only for text type
            },
          },
          y: {
            type: Number,
            required: function () {
              return this.type === "text"; // Required only for text type
            },
          },
        },
      },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reactions: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      laugh: { type: Number, default: 0 },
      sad: { type: Number, default: 0 },
      angry: { type: Number, default: 0 },
    },
    reactors: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reactionType: {
          type: String,
          enum: ["like", "love", "laugh", "sad", "angry"],
          required: true,
        },
      },
    ],
  },

  {
    timestamps: true, // Enable createdAt and updatedAt timestamps
  }
);

const Whiteboard = mongoose.model("Whiteboard", whiteboardSchema);
module.exports = Whiteboard;
