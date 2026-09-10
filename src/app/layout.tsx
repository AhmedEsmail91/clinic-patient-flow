import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Providers } from "./providers";
import { localeFromCookie } from "@/i18n/server";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8080";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Daffodil Clinic",
    template: "%s | Daffodil Clinic",
  },
  description:
    "Daffodil Clinic patient portal — book appointments, consult doctors online, and manage your care.",
  authors: [{ name: "Daffodil Clinic" }],
  openGraph: {
    type: "website",
    siteName: "Daffodil Clinic",
    title: "Daffodil Clinic",
    description:
      "Daffodil Clinic patient portal — book appointments, consult doctors online, and manage your care.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daffodil Clinic",
    description:
      "Daffodil Clinic patient portal — book appointments, consult doctors online, and manage your care.",
  },
};

const clinicJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "Daffodil Clinic",
  url: siteUrl,
  telephone: "+15551234567",
  medicalSpecialty: [
    "PrimaryCare",
    "Pediatric",
    "Cardiovascular",
    "Dermatologic",
    "Musculoskeletal",
    "Gynecologic",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = localeFromCookie(cookies().get("locale")?.value);

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
