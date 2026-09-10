import { cookies } from "next/headers";
import Link from "next/link";
import { MotionDiv } from "@/components/layout/motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import { getServerT, localeFromCookie } from "@/i18n/server";
import { Heart, Baby, Activity, Shield, Bone, Users, Clock, MapPin, Phone, CheckCircle, Star } from "lucide-react";

export default function HomeView() {
  const locale = localeFromCookie(cookies().get("locale")?.value);
  const t = getServerT(locale);

  const services = [
    { icon: Heart, title: t("services.general"), description: t("services.general.desc") },
    { icon: Baby, title: t("services.pediatrics"), description: t("services.pediatrics.desc") },
    { icon: Activity, title: t("services.cardiology"), description: t("services.cardiology.desc") },
    { icon: Shield, title: t("services.dermatology"), description: t("services.dermatology.desc") },
    { icon: Bone, title: t("services.orthopedics"), description: t("services.orthopedics.desc") },
    { icon: Users, title: t("services.gynecology"), description: t("services.gynecology.desc") },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5 pointer-events-none"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <MotionDiv initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6">{t("hero.title")}</h1>
              <p className="text-xl md:text-2xl text-primary-light mb-4">{t("hero.slogan")}</p>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{t("hero.description")}</p>
              <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="btn-medical text-lg px-8 py-4 h-auto">
                  <Link href="/appointment">{t("hero.cta")}</Link>
                </Button>
              </MotionDiv>
            </MotionDiv>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-accent/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">{t("about.title")}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">{t("about.description")}</p>
            <p className="text-lg text-foreground max-w-3xl mx-auto">{t("about.mission")}</p>
          </MotionDiv>

          <MotionDiv
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: CheckCircle, title: "20+ Years", subtitle: "Of Excellence" },
              { icon: Users, title: "10,000+", subtitle: "Happy Patients" },
              { icon: Star, title: "4.9/5", subtitle: "Patient Rating" },
            ].map((stat, index) => (
              <MotionDiv key={index} variants={fadeInUp}>
                <Card className="medical-card text-center p-6">
                  <CardContent className="pt-6">
                    <stat.icon className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-primary mb-2">{stat.title}</h3>
                    <p className="text-muted-foreground">{stat.subtitle}</p>
                  </CardContent>
                </Card>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </section>

      <section id="services" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">{t("services.title")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive healthcare services with experienced professionals
            </p>
          </MotionDiv>

          <MotionDiv
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <MotionDiv key={index} variants={fadeInUp}>
                <Card className="medical-card h-full">
                  <CardHeader>
                    <div className="w-12 h-12 medical-gradient rounded-lg flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl text-primary">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
                  </CardContent>
                </Card>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MotionDiv {...fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Book Your Appointment?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of satisfied patients who trust us with their health
              </p>
              <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-4 h-auto bg-secondary hover:bg-secondary/90"
                >
                  <Link href="/appointment">{t("hero.cta")}</Link>
                </Button>
              </MotionDiv>
            </MotionDiv>
          </div>

          <MotionDiv
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mt-16"
          >
            {[
              { icon: Clock, title: "Hours", subtitle: "Mon-Fri 8AM-6PM" },
              { icon: MapPin, title: "Location", subtitle: "123 Health St, Medical District" },
              { icon: Phone, title: "Emergency", subtitle: "+1 (555) 123-4567" },
            ].map((contact, index) => (
              <MotionDiv key={index} variants={fadeInUp} className="text-center">
                <contact.icon className="w-8 h-8 mx-auto mb-4 opacity-90" />
                <h3 className="text-lg font-semibold mb-2">{contact.title}</h3>
                <p className="opacity-80">{contact.subtitle}</p>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </section>

      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">
            © 2024 Daffodil Clinic. All rights reserved. | Your health is our priority.
          </p>
        </div>
      </footer>
    </div>
  );
}
