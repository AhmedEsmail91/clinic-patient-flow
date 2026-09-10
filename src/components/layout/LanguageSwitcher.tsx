"use client";

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const router = useRouter();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Server Components (home page, my appointments) render text via the
    // 'locale' cookie the line above just updated - refresh so they pick
    // it up too, alongside the instant client-side re-render below.
    router.refresh();
  };

  useEffect(() => {
    // Apply RTL/LTR direction based on language
    const direction = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", direction);
    document.documentElement.setAttribute("lang", i18n.language);
  }, [i18n.language]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="w-4 h-4" />
          {i18n.language === "ar" ? "العربية" : "English"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border border-border">
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className={`cursor-pointer ${i18n.language === "en" ? "bg-accent" : ""}`}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("ar")}
          className={`cursor-pointer ${i18n.language === "ar" ? "bg-accent" : ""}`}
        >
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
