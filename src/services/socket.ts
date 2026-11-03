import { io } from "socket.io-client";

const socketUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

export const socket = io(socketUrl, {
  transports: ["websocket", "polling"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 2000,
});

socket.on("connect", () => {
  console.log("⚡ Connected to realtime AI therapy socket");
});

socket.on("connect_error", () => {
  // Silent fallback to client-side therapy engine
});
