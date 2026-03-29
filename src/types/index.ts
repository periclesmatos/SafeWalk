// Location & Sensors
export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface SensorData {
  x: number;
  y: number;
  z: number;
}

export interface AccelerometerReading extends SensorData {
  magnitude: number;
  timestamp: number;
}

// Contacts & Alerts
export interface Contact {
  name: string;
  phone: string;
  email?: string;
  emergencyContactName?: string;
}

export interface AlertHistory {
  id: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  status: 'sent' | 'pending' | 'failed';
}

// Navigation
export type TabName = 'home' | 'map' | 'settings' | 'history';

export interface TabItem {
  name: TabName;
  label: string;
  icon: (color: string) => React.ReactNode;
  component: React.FC;
}

// API/Response Types (para futuro)
export interface AlertResponse {
  success: boolean;
  message: string;
  timestamp: number;
}

// Error Types
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export type ErrorCode =
  | 'GPS_PERMISSION_DENIED'
  | 'GPS_UNAVAILABLE'
  | 'SENSOR_UNAVAILABLE'
  | 'INVALID_CONTACT'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';
