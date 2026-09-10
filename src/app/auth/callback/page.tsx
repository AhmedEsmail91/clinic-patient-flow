import type { Metadata } from "next";
import GoogleCallbackView from "@/features/auth/GoogleCallbackView";

export const metadata: Metadata = {
  title: "Signing you in...",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <GoogleCallbackView />;
}
