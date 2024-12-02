import express from "express";
import http from "http";
import { Server } from "socket.io";
import { BaseEvent, EventType } from "./types/events";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust in production
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Listen for each specific event type
  Object.values(EventType).forEach((eventType) => {
    socket.on(eventType, async (event: BaseEvent) => {
      console.log("socket on");
    });
  });

  // Listen for chat messages
  socket.on("chat_message", (message) => {
    console.log("Received message:", message);
    // Broadcast the message to all connected clients
    io.emit("chat_message", message);
  });

  // Retrieve recent events for a specific type
  socket.on(
    "get_recent_events",
    async (eventType: EventType, limit?: number) => {
      try {
        socket.emit("recent_events");
      } catch (error) {
        socket.emit("server_error", {
          message: "Failed to retrieve events",
          error: String(error),
        });
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
