"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export default function GoogleCallbackView() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const from = "/appointment";

  useEffect(() => {
    toast({
      title: t("auth.login.title.success"),
      description: t("auth.login.description.success"),
    });

    router.replace(from);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <p>Logging you in with Google...</p>;
}
