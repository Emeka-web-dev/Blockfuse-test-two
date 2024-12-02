import { Socket } from "socket.io";
import { ValidationMiddleware } from "../middleware/validateMiddleware";
import { EventModel } from "../models/eventModel";
import { BaseEvent } from "../types/events";

export class EventController {
  static async handleEvent(socket: Socket, event: BaseEvent) {
    try {
      // Validate base event structure
      if (!ValidationMiddleware.validateEvent(event)) {
        socket.emit("event_error", {
          message: "Invalid event structure",
          event,
        });
        return;
      }

      // Validate specific event type
      if (!ValidationMiddleware.validateSpecificEvent(event)) {
        socket.emit("event_error", {
          message: "Invalid event data",
          event,
        });
        return;
      }

      // Save event to database
      await EventModel.saveEvent(event);

      // Broadcast event to all connected clients
      socket.broadcast.emit("event_received", event);
    } catch (error) {
      console.error("Event processing error:", error);
      socket.emit("server_error", {
        message: "Failed to process event",
        error: String(error),
      });
    }
  }
}
