import { io } from "socket.io-client";

let socket = null;
export function connectSocket() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  if (socket?.connected) return socket;
  socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5173", {
    auth: { token },
    transports: ["websocket"],
  });
  return socket;
}
export function getSocket() { return socket; }
export function disconnectSocket() { socket?.disconnect(); socket = null; }
