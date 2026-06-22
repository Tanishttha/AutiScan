

import { io } from "socket.io-client";

export const socket = io(
  "http://localhost:5002",
  {
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000
  }
);

socket.on("connect", () => {
  console.log(
    "⚡ Connected to realtime AI therapy server"
  );
});

socket.on("disconnect", () => {
  console.log(
    "❌ Disconnected from realtime AI server"
  );
});