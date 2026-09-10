import type { Metadata } from "next";
import HomeView from "@/features/home/HomeView";

export const metadata: Metadata = {
  title: "Daffodil Clinic - Book Appointments Online",
  description:
    "Book appointments with experienced doctors at Daffodil Clinic. General medicine, pediatrics, cardiology, dermatology, orthopedics and gynecology, online or in person.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HomeView />;
}
