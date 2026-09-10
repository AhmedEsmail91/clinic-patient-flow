import { cookies } from "next/headers";
import Link from "next/link";
import { MotionDiv } from "@/components/layout/motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, FileText, HourglassIcon } from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/layout/Header";
import { getServerT, localeFromCookie } from "@/i18n/server";
import { APPOINTMENT_STATUS_STYLES } from "@/constants";
import type { Appointment } from "@/types";

export default function AppointmentList({ appointments }: { appointments: Appointment[] }) {
  const locale = localeFromCookie(cookies().get("locale")?.value);
  const t = getServerT(locale);

  const hasUpcoming = appointments.some((a) => a.status === "scheduled" || a.status === "pending");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-primary">
                {t("appointment.myAppointments.header.title")}
              </CardTitle>
              <CardDescription>{t("appointment.myAppointments.header.description")}</CardDescription>
              {!hasUpcoming && (
                <Button asChild className="btn-medical text-lg px-6 py-4 h-auto">
                  <Link href="/appointment">{t("hero.cta")}</Link>
                </Button>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {appointments.map((appt) => {
                const canJoinMeeting =
                  appt.appointment_mode === "online" && appt.status === "scheduled" && appt.online_meeting?.link;

                return (
                  <MotionDiv
                    key={appt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {appt.title}-{t(`appointment.myAppointments.type.${appt.type}`)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t("appointment.mode." + appt.appointment_mode)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${APPOINTMENT_STATUS_STYLES[appt.status]} text-center capitalize`}
                      >
                        {t("appointment.myAppointments.status." + appt.status)}
                      </Badge>
                    </div>

                    {/* The Backend may return an appointment whose schedule was
                        removed/reassigned (e.g. cancelled schedule), so `schedule`
                        can be absent here - render the date/time only when present
                        instead of assuming appt.schedule.from always exists. */}
                    <div className="mt-3 space-y-2 text-sm">
                      {appt.schedule?.from && (
                        <>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{format(new Date(appt.schedule.from), "M/d/yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{format(new Date(appt.schedule.from), "p")}</span>
                          </div>
                        </>
                      )}
                      {appt.notes && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{appt.notes.split("admin:data:notes::")[0]}</span>
                        </div>
                      )}
                      {appt.status === "scheduled" && appt.turn != null && (
                        <div className="flex items-center gap-2">
                          <HourglassIcon className="w-4 h-4" />
                          <span>
                            {t("appointment.turn")} {appt.turn}
                          </span>
                        </div>
                      )}
                    </div>

                    {canJoinMeeting && (
                      <div className="mt-4 flex gap-3">
                        <a
                          href={appt.online_meeting!.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          {t("appointment.meeting.join")}
                        </a>
                      </div>
                    )}
                  </MotionDiv>
                );
              })}

              {appointments.length === 0 && (
                <p className="text-center text-muted-foreground">{t("appointment.myAppointments.not.found")}</p>
              )}
            </CardContent>
          </Card>
        </MotionDiv>
      </div>
    </div>
  );
}
