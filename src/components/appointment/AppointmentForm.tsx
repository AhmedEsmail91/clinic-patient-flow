"use client";

import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateForm, appointmentSchema } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/AuthContext";
import Header from "@/components/layout/Header";
import { format } from "date-fns";
import { createAppointment as createAppointmentRequest } from "@/lib/api/appointments";
import { ImageUpload } from "@/components/ui/image-upload";
import { PhoneInput } from "@/components/ui/phone-input";
import { DEFAULT_SCOPE_ID } from "@/constants";
import type { AppointmentFormData, Schedule, Scope } from "@/types";

interface AppointmentFormProps {
  initialSchedules?: Schedule[];
  initialScopes?: Scope[];
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ initialSchedules = [], initialScopes = [] }) => {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const { retryUserFetch } = useAuth();

  const [formData, setFormData] = useState<AppointmentFormData>({
    schedule_id: "",
    contact: "",
    type: "consultation",
    appointment_mode: "online",
    notes: "",
    countryCode: "eg",
    scope_id: DEFAULT_SCOPE_ID,
    images: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  // Schedules and scopes are fetched server-side (see app/appointment/page.tsx)
  // and passed in as initial data instead of being fetched again on mount.
  const [schedules] = useState(initialSchedules);
  const [scopes] = useState(initialScopes);

  const createAppointment = useMutation({
    mutationFn: createAppointmentRequest,
  });

  const handleChange = (field: keyof AppointmentFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const imagesForValidation = formData.images.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
    }));
    const validation = validateForm(appointmentSchema, {
      ...formData,
      images: imagesForValidation,
    });
    if (!validation.isValid) {
      setErrors(validation.errors || {});
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
      });
      return;
    }

    try {
      await createAppointment.mutateAsync(formData);

      toast({
        title: "Appointment Created",
        description: "Your appointment has been booked successfully.",
      });

      router.push("/myAppointments");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await retryUserFetch();
      } else {
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
        toast({
          variant: "destructive",
          title: "Error",
          description: message || "Please try again.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-primary">{t("appointment.title")}</CardTitle>
              <CardDescription className="text-muted-foreground">
                Select an available schedule and fill in details
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label>Contact</Label>
                  <PhoneInput
                    value={formData.contact}
                    onChange={(value) => handleChange("contact", value)}
                    countryCode={formData.countryCode}
                    onCountryChange={(country) => handleChange("countryCode", country.code)}
                  />
                  {errors.contact && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.contact}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Schedule</Label>
                  <Select onValueChange={(v) => handleChange("schedule_id", v)} value={formData.schedule_id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      {schedules.length === 0 && (
                        <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                          No schedules available right now.
                        </div>
                      )}
                      {schedules.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {i18n.language === "ar"
                            ? `${format(new Date(s.from), "yyyy/MM/dd")} • ${format(new Date(s.from), "hh:mm a")
                                .replace("AM", "ص")
                                .replace("PM", "م")} إلى ${format(new Date(s.to), "hh:mm a")
                                .replace("AM", "ص")
                                .replace("PM", "م")}`
                            : `${format(new Date(s.from), "MM/dd/yyyy")} • ${format(new Date(s.from), "hh:mm a")} → ${format(
                                new Date(s.to),
                                "hh:mm a"
                              )}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.schedule_id && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.schedule_id}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>{t("appointment.type.title")}</Label>
                  <Select onValueChange={(v) => handleChange("type", v)} value={formData.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">{t("appointment.type.consultation")}</SelectItem>
                      <SelectItem value="follow-up">{t("appointment.type.follow-up")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>{t("appointment.scope.title")}</Label>
                  <Select onValueChange={(v) => handleChange("scope_id", v)} value={formData.scope_id}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("appointment.scope.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {scopes.map((scope) => (
                        <SelectItem key={scope.id} value={scope.id}>
                          {i18n.language === "ar" ? scope.name_ar : scope.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>{t("appointment.mode.title")}</Label>
                  <Select onValueChange={(v) => handleChange("appointment_mode", v)} value={formData.appointment_mode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">{t("appointment.mode.online")}</SelectItem>
                      <SelectItem value="in-person">{t("appointment.mode.in-person")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>{t("appointment.notes.title")}</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder={t("appointment.notes.placeholder")}
                    className="min-h-[100px]"
                  />
                </div>

                <ImageUpload formData={formData} setFormData={setFormData} />

                <Button
                  type="submit"
                  disabled={createAppointment.isPending || !formData.schedule_id}
                  className="w-full btn-medical text-lg py-3"
                >
                  {createAppointment.isPending ? t("common.loading") : "Create Appointment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AppointmentForm;
