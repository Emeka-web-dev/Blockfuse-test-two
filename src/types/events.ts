export enum EventType {
  USER_LOGIN = "USER_LOGIN",
  DEVICE_STATUS = "DEVICE_STATUS",
  SENSOR_DATA = "SENSOR_DATA",
  SYSTEM_ALERT = "SYSTEM_ALERT",
  TRANSACTION_LOG = "TRANSACTION_LOG",
}

export interface BaseEvent {
  type: EventType;
  timestamp: number;
  clientId: string;
}

export interface UserLoginEvent extends BaseEvent {
  type: EventType.USER_LOGIN;
  username: string;
  ipAddress: string;
  success: boolean;
}

export interface DeviceStatusEvent extends BaseEvent {
  type: EventType.DEVICE_STATUS;
  deviceId: string;
  status: "ONLINE" | "OFFLINE" | "MAINTENANCE";
  batteryLevel?: number;
}

export interface SensorDataEvent extends BaseEvent {
  type: EventType.SENSOR_DATA;
  sensorId: string;
  temperature?: number;
  humidity?: number;
  pressure?: number;
}

export interface SystemAlertEvent extends BaseEvent {
  type: EventType.SYSTEM_ALERT;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
}

export interface TransactionLogEvent extends BaseEvent {
  type: EventType.TRANSACTION_LOG;
  transactionId: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
}
