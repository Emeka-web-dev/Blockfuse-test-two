import { BaseEvent, EventType, UserLoginEvent } from "./types/events";

export class ValidationMiddleware {
  static validateEvent(event: BaseEvent): boolean {
    // Basic validation checks
    if (!event.type || !Object.values(EventType).includes(event.type)) {
      return false;
    }

    if (!event.timestamp || event.timestamp > Date.now()) {
      return false;
    }

    if (!event.clientId || event.clientId.trim() === "") {
      return false;
    }

    return true;
  }

  static validateSpecificEvent(event: BaseEvent): boolean {
    switch (event.type) {
      case EventType.USER_LOGIN:
        return this.validateUserLoginEvent(event);
      case EventType.DEVICE_STATUS:
        return this.validateUserLoginEvent(event);
      case EventType.SENSOR_DATA:
        return this.validateSpecificEvent(event);
      default:
        return false;
    }
  }

  private static validateUserLoginEvent(event: BaseEvent): boolean {
    const loginEvent = event as UserLoginEvent;
    return (
      !!loginEvent.username &&
      loginEvent.success !== undefined &&
      !!loginEvent.ipAddress
    );
  }

  // Similar validation methods for other event types...
}
