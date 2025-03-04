const mongoose = require("mongoose");

const whiteboardSchema = new mongoose.Schema(
  {
    drawingTitle: { type: String, required: true },

    backgroundColor: { type: String, required: false },
    canvasSize: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    shapes: [
      {
        uuid: { type: String, required: true },
        type: {
          type: String,
          enum: [
            "line",
            "circle",
            "rectangle",
            "triangle",
            "pentagon",
            "hexagon",
            "text",
            "pen",
            "emoji",
            "image",
            "brush",
          ],
          required: true,
        },
        color: { type: String, required: false },
        fill: { type: String, required: false },
        fontSize: { type: Number, required: false },
        fontWeight: { type: String, required: false },
        fontStyle: { type: String, required: false },
        textDecoration: { type: String, required: false },
        fontFamily: { type: String, required: false },
        x: { type: Number, required: () => this.type === "image" },
        y: { type: Number, required: () => this.type === "image" },
        width: { type: Number, required: () => this.type === "image" },
        height: { type: Number, required: () => this.type === "image" },
        imgSrc: { type: String, required: () => this.type === "image" },
        brush: {
          type: {
            type: String,
            enum: ["pencil", "airbrush", "marker"],
            required: function () {
              return this.type === "brush";
            },
          },
          size: {
            type: Number,
            required: function () {
              return this.type === "brush";
            },
          },
          hardness: {
            type: Number,
            required: function () {
              return this.type === "brush";
            },
          },
          color: {
            type: String,
            required: function () {
              return this.type === "brush";
            },
          },
        },

        start: {
          x: {
            type: Number,
            required: function () {
              return (
                this.type === "line" ||
                this.type === "rectangle" ||
                this.type === "triangle" ||
                this.type === "pentagon" ||
                this.type === "hexagon"
              );
            },
          },
          y: {
            type: Number,
            required: function () {
              return (
                this.type === "line" ||
                this.type === "rectangle" ||
                this.type === "triangle" ||
                this.type === "pentagon" ||
                this.type === "hexagon"
              );
            },
          },
        },
        end: {
          x: {
            type: Number,
            required: function () {
              return (
                this.type === "line" ||
                this.type === "rectangle" ||
                this.type === "triangle" ||
                this.type === "pentagon" ||
                this.type === "hexagon"
              );
            },
          },
          y: {
            type: Number,
            required: function () {
              return (
                this.type === "line" ||
                this.type === "rectangle" ||
                this.type === "triangle" ||
                this.type === "pentagon" ||
                this.type === "hexagon"
              );
            },
          },
        },
        // Path for pen drawings
        path: [
          {
            x: {
              type: Number,
              required: function () {
                return this.type === "pen" || this.type === "brush";
              },
            },
            y: {
              type: Number,
              required: function () {
                return this.type === "pen" || this.type === "brush";
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
        // Emoji field
        emoji: {
          type: String, // Emoji as a string
          required: function () {
            return this.type === "emoji"; // Required only for emoji type
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
