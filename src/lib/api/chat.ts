import { apiClient } from "./client";

// Starts (or resumes) the patient's chat thread with the clinic. Messages
// themselves flow through Firestore in real time (see lib/firebase.ts and
// components/patient/ChatWidget.tsx) - only the thread's creation is a REST
// call, matching the Backend's chat REST + Firestore/FCM architecture.
export async function startPatientChat(): Promise<string> {
  const res = await apiClient.post("/api/patient/chats");
  return res.data.chat.id as string;
}
