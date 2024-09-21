const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const whiteboardRoutes = require("./routes/whiteboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const BaseRoutes = require("./routes/baseRoutes");
const cookieParser = require("cookie-parser");
const { setupSocket } = require("./config/socket");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Middleware
app.use(cookieParser());

// Routes
app.use("", BaseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/whiteboards", whiteboardRoutes);
app.use("/api/notifications", notificationRoutes);

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
setupSocket(server); // Call the socket setup function

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
