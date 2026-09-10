import { apiClient } from "./client";
import type { Schedule } from "@/types";

export async function fetchActiveSchedules(): Promise<Schedule[]> {
  const res = await apiClient.get("/api/patient/schedules?status=active");
  return res.data?.schedules?.data ?? [];
}
