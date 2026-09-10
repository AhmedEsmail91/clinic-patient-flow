"use client";

import { useTranslation } from "react-i18next";
import { ChatWidget } from "@/components/patient/ChatWidget";
import { useAuth } from "@/lib/auth/AuthContext";
import { WhatsAppWidget } from "./WhatsAppWidget";

export default function Widgets() {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const isRTL = i18n.language === "ar";

  return (
    <div className={`fixed bottom-5 ${isRTL ? "left-5" : "right-5"} flex flex-col items-end gap-6 z-50`}>
      {isAuthenticated && <ChatWidget isRTL={isRTL} />}
      <WhatsAppWidget />
    </div>
  );
}
