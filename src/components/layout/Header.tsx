"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { LogOut, User, Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <img src="/logo.jpg" alt="Daffodil Clinic" className="text-primary-foreground object-cover rounded-full" />
              </div>
              <span className="text-xl font-bold text-primary">{t("hero.title")}</span>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link href="/" className="text-foreground hover:text-primary smooth-transition font-medium">
              {t("nav.home")}
            </Link>
            <a href="/#about" className="text-foreground hover:text-primary smooth-transition font-medium">
              {t("nav.about")}
            </a>
            <a href="/#services" className="text-foreground hover:text-primary smooth-transition font-medium">
              {t("nav.services")}
            </a>
            {isAuthenticated && (
              <Link
                href="/myAppointments"
                className="text-foreground text-center hover:text-primary smooth-transition font-medium"
              >
                {t("nav.myAppointments")}
              </Link>
            )}
          </nav>

          {/* Right section (Auth & Language) */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  <span className="hidden sm:block">{t("nav.logout")}</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button variant="ghost" asChild>
                  <Link href="/login">{t("nav.login")}</Link>
                </Button>
                <Button variant="default" asChild className="medical-gradient">
                  <Link href="/register">{t("nav.register")}</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Burger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-foreground hover:bg-accent"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 bg-card border-t border-border shadow-md p-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              <Link href="/" onClick={() => setMobileOpen(false)} className="text-foreground hover:text-primary">
                {t("nav.home")}
              </Link>
              <a href="/#about" onClick={() => setMobileOpen(false)} className="text-foreground hover:text-primary">
                {t("nav.about")}
              </a>
              <a href="/#services" onClick={() => setMobileOpen(false)} className="text-foreground hover:text-primary">
                {t("nav.services")}
              </a>
              {isAuthenticated && (
                <Link
                  href="/myAppointments"
                  onClick={() => setMobileOpen(false)}
                  className="text-foreground hover:text-primary"
                >
                  {t("nav.myAppointments")}
                </Link>
              )}
            </nav>

            <div className="pt-4 border-t border-border">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="mt-3 w-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("nav.logout")}
                </Button>
              ) : (
                <div className="flex flex-col space-y-2 mt-3">
                  <Button variant="ghost" asChild onClick={() => setMobileOpen(false)}>
                    <Link href="/login">{t("nav.login")}</Link>
                  </Button>
                  <Button variant="default" asChild className="medical-gradient" onClick={() => setMobileOpen(false)}>
                    <Link href="/register">{t("nav.register")}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
