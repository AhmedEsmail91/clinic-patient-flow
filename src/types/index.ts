export interface User {
  id: string;
  name: string;
  email: string;
  role: { id: string; name: string };
}

export interface Schedule {
  id: string;
  from: string;
  to: string;
}

export interface Scope {
  id: string;
  name_en: string;
  name_ar: string;
}

export type AppointmentType = "consultation" | "follow-up" | "emergency";
export type AppointmentMode = "online" | "in-person";
export type AppointmentStatus = "pending" | "scheduled" | "completed" | "cancelled";

export interface OnlineMeeting {
  link: string;
}

export interface Appointment {
  id: string;
  title?: string;
  type: AppointmentType;
  appointment_mode: AppointmentMode;
  status: AppointmentStatus;
  notes?: string;
  turn?: number;
  schedule?: Schedule;
  online_meeting?: OnlineMeeting;
}

export interface AppointmentFormData {
  schedule_id: string;
  contact: string;
  type: AppointmentType;
  appointment_mode: AppointmentMode;
  notes: string;
  countryCode: string;
  scope_id: string;
  images: File[];
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_type: "patient" | "admin";
  content: string;
  is_pinned?: boolean;
}

export interface FormValidationResult<T = Record<string, unknown>> {
  isValid: boolean;
  errors?: Record<string, string>;
  value?: T;
}

// Shape of the JSON error body the Backend returns for a failed request.
export interface ApiErrorBody {
  message?: string;
  error?: string;
}
