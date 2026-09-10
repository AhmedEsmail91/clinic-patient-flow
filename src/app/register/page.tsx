import type { Metadata } from "next";
import RegisterView from "@/features/auth/RegisterView";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a Daffodil Clinic patient account to book appointments online.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <RegisterView />;
}
