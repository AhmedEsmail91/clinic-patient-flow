// Default clinical scope pre-selected on the appointment booking form.
// TODO(backend): the Backend currently has no "default scope" endpoint, so
// this id is carried over from the previous implementation. If the Backend
// starts returning a default/marked scope, prefer that instead.
export const DEFAULT_SCOPE_ID = "9e3bee0a-c64f-496c-8831-e50d78a824f1";

export const PROTECTED_PATHS = ["/appointment", "/myAppointments"];

export const SUPPORTED_LOCALES = ["en", "ar"] as const;

export const APPOINTMENT_STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  scheduled: "bg-blue-100 text-blue-800 border-blue-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

export const PHONE_COUNTRIES = [
  { code: "eg", dialCode: "+20", flag: "🇪🇬" },
  { code: "sa", dialCode: "+966", flag: "🇸🇦" },
  { code: "ae", dialCode: "+971", flag: "🇦🇪" },
  { code: "us", dialCode: "+1", flag: "🇺🇸" },
  { code: "uk", dialCode: "+44", flag: "🇬🇧" },
] as const;
