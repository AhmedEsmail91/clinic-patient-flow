import type { Metadata } from "next";
import { Suspense } from "react";
import LoginView from "@/features/auth/LoginView";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Daffodil Clinic patient account.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginView />
    </Suspense>
  );
}
