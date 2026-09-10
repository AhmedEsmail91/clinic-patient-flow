import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AppointmentForm from "@/components/appointment/AppointmentForm";
import { serverFetch } from "@/lib/api/server-client";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Select a schedule and book your appointment at Daffodil Clinic.",
  robots: { index: false, follow: true },
};

export default async function Page() {
  const [schedulesRes, scopesRes] = await Promise.all([
    serverFetch("/api/patient/schedules?status=active"),
    serverFetch("/api/patient/scopes"),
  ]);

  if (schedulesRes.status === 401 || scopesRes.status === 401) {
    redirect("/login?from=%2Fappointment");
  }

  const schedulesData = schedulesRes.ok ? await schedulesRes.json() : null;
  const scopesData = scopesRes.ok ? await scopesRes.json() : null;

  return (
    <ProtectedRoute>
      <AppointmentForm
        initialSchedules={schedulesData?.schedules?.data ?? []}
        initialScopes={scopesData ?? []}
      />
    </ProtectedRoute>
  );
}
