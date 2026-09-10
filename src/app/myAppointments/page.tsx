import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/api/server-client";
import AppointmentList from "@/components/appointment/AppointmentList";

export const metadata: Metadata = {
  title: "My Appointments",
  description: "View your booked appointments at Daffodil Clinic.",
  robots: { index: false, follow: true },
};

export default async function Page() {
  const res = await serverFetch("/api/patient/appointments");

  if (res.status === 401) {
    // Middleware already checked the auth cookie's presence; a 401 here
    // means it's present but expired/invalid - simplest correct move is
    // sending the user back to log in again, rather than replicating the
    // client's silent refresh-and-retry from a Server Component.
    redirect("/login?from=%2FmyAppointments");
  }

  const data = res.ok ? await res.json() : null;
  const appointments = data?.appointments?.data ?? [];

  return <AppointmentList appointments={appointments} />;
}
