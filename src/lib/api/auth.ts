import { apiClient } from "./client";
import type { User } from "@/types";

export async function fetchCurrentUser(): Promise<User> {
  const res = await apiClient.get("/api/auth/me");
  return res.data.user;
}

export async function login(email: string, password: string): Promise<User> {
  const res = await apiClient.post("/api/auth/login", { email, password });
  return res.data.user;
}

export async function register(name: string, email: string, password: string): Promise<User> {
  const res = await apiClient.post("/api/auth/register", { name, email, password });
  return res.data.user;
}

export async function logout(): Promise<void> {
  await apiClient.post("/api/auth/logout");
}

export async function refreshSession(): Promise<void> {
  await apiClient.post("/api/auth/refresh");
}

export async function fetchFirebaseToken(): Promise<string> {
  const res = await apiClient.get("/api/auth/firebase-token");
  return res.data.firebaseToken;
}

export function googleOAuthUrl(): string {
  return `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/patient`;
}
