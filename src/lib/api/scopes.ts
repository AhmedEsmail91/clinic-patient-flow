import { apiClient } from "./client";
import type { Scope } from "@/types";

export async function fetchScopes(): Promise<Scope[]> {
  const res = await apiClient.get("/api/patient/scopes");
  return res.data ?? [];
}
