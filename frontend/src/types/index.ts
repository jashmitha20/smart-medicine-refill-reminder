export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Medicine {
  id: number;
  medicineName: string;
  dosagePerDay: number;
  totalQuantity: number;
  startDate: string;
  refillDate: string;
  currentQuantity: number;
  notificationsEnabled: boolean;
  lowStockThreshold: number;
  status: MedicineStatus;
  createdAt: string;
  updatedAt: string;
  daysLeft: number;
  remainingDoses: number;
  refillUrl: string;
}

export enum MedicineStatus {
  OK = 'OK',
  LOW = 'LOW',
  REFILL_NEEDED = 'REFILL_NEEDED'
}

export interface MedicineRequest {
  medicineName: string;
  dosagePerDay: number;
  totalQuantity: number;
  startDate: string;
  currentQuantity?: number;
  notificationsEnabled?: boolean;
  lowStockThreshold?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

export interface DashboardSummary {
  totalMedicines: number;
  refillNeeded: number;
  lowStock: number;
  ok: number;
  recentMedicines: Medicine[];
}

export interface ApiError {
  error: string;
  message?: string;
}

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  autoHide?: boolean;
}

// Reminder types for local notification scheduling
export interface ReminderInput {
  medicineId: number;
  time: string; // HH:mm in local time
  label?: string;
  daysOfWeek?: number[]; // 0-6 (Sun-Sat); if empty/undefined = every day
  enabled?: boolean; // default true
}

export interface Reminder extends ReminderInput {
  id: string; // uuid
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
