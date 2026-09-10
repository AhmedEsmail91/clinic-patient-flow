import { apiClient } from "./client";
import type { Appointment, AppointmentFormData } from "@/types";

export async function fetchAppointments(): Promise<Appointment[]> {
  const res = await apiClient.get("/api/patient/appointments");
  return res.data?.appointments?.data ?? [];
}

export async function createAppointment(data: AppointmentFormData) {
  const formData = new FormData();
  formData.append("schedule_id", data.schedule_id);
  formData.append("scope_id", data.scope_id);
  formData.append("contact", data.contact);
  formData.append("type", data.type);
  formData.append("countryCode", data.countryCode);
  formData.append("appointment_mode", data.appointment_mode);
  formData.append("notes", data.notes);
  data.images.forEach((file) => formData.append("images", file, file.name));

  return apiClient.post("/api/patient/appointments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
