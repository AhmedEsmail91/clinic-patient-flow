"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth/AuthContext";
import { validateForm, registerSchema } from "@/lib/validation";
import { googleOAuthUrl } from "@/lib/api/auth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";

const RegisterView: React.FC = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm(registerSchema, formData);
    if (!validation.isValid) {
      setErrors(validation.errors || {});
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast({ title: "Welcome to Daffodil Clinic!", description: "Your account has been created successfully." });
      router.push("/appointment");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      toast({ variant: "destructive", title: "Registration Failed", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = googleOAuthUrl();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <Button variant="ghost" asChild className="mb-6 hover:bg-accent">
            <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </Button>

          <Card className="medical-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">{t("auth.register.title")}</CardTitle>
              <CardDescription className="text-muted-foreground">{t("auth.register.subtitle")}</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-medium">
                    {t("auth.register.name")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`pl-10 rtl:pl-3 rtl:pr-10 ${errors.name ? "border-destructive" : ""}`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription>{errors.name}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    {t("auth.register.email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 rtl:pl-3 rtl:pr-10 ${errors.email ? "border-destructive" : ""}`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription>{errors.email}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">
                    {t("auth.register.password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 pr-10 rtl:pl-10 rtl:pr-10 ${errors.password ? "border-destructive" : ""}`}
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription>{errors.password}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                    {t("auth.register.confirmPassword")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`pl-10 pr-10 rtl:pl-10 rtl:pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription>{errors.confirmPassword}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full btn-medical">
                  {isLoading ? t("common.loading") : t("auth.register.submit")}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button type="button" variant="outline" onClick={handleGoogleSignup} className="w-full border-2 hover:bg-accent">
                  <svg className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {t("auth.register.google")}
                </Button>

                <div className="text-center">
                  <span className="text-muted-foreground">{t("auth.register.hasAccount")} </span>
                  <Link href="/login" className="text-primary hover:text-primary-dark smooth-transition font-medium">
                    {t("auth.register.loginLink")}
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterView;
