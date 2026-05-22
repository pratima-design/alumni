const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_ORIGIN || "*", methods: ["GET", "POST"] },
  });

  // Authenticate every socket connection with the JWT
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("_id name role");
      if (!user) return next(new Error("User not found"));
      socket.user = user;
      next();
    } catch (e) {
      next(new Error("Auth error"));
    }
  });

  io.on("connection", (socket) => {
    // Personal room for DMs + notifications
    socket.join(`user:${socket.user._id}`);
    console.log(`Socket connected: ${socket.user.name}`);

    socket.on("dm:send", ({ to, message }) => {
      io.to(`user:${to}`).emit("dm:receive", { from: socket.user._id, message });
    });

    socket.on("group:join", (groupId) => socket.join(`group:${groupId}`));
    socket.on("group:leave", (groupId) => socket.leave(`group:${groupId}`));
    socket.on("group:send", ({ groupId, message }) => {
      io.to(`group:${groupId}`).emit("group:receive", {
        from: socket.user._id, groupId, message,
      });
    });

    socket.on("typing", ({ to, groupId }) => {
      if (to) io.to(`user:${to}`).emit("typing", { from: socket.user._id });
      if (groupId) socket.to(`group:${groupId}`).emit("typing", { from: socket.user._id, groupId });
    });

    socket.on("disconnect", () => console.log(`Socket disconnected: ${socket.user.name}`));
  });

  return io;
};
