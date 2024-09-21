const { Server } = require("socket.io");

let io;

const setupSocket = (server) => {
  // Initialize Socket.IO
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Listen for socket connections
  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Handle client disconnection
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

// Function to emit notifications
const emitNotification = (notification) => {
  if (io) {
    io.emit("receiveNotification", notification);
  }
};

module.exports = {
  setupSocket,
  emitNotification,
};
