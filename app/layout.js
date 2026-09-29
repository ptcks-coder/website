import "./globals.css";
import { Suspense } from "react";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { COMPANY } from "@/data/site";
import { getSettings } from "@/lib/settings";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import SeoScripts from "@/components/SeoScripts";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export async function generateMetadata() {
  const settings = await getSettings();
  const title = settings.siteTitle || `${COMPANY.brand} — ${COMPANY.legalName}`;
  const description =
    settings.metaDescription || `${COMPANY.legalName} (${COMPANY.brand}) — ${COMPANY.tagline}`;

  return {
    title: {
      default: title,
      template: `%s | ${COMPANY.brand}`
    },
    description,
    icons: {
      icon: "/logo-cks.png"
    },
    robots: settings.robotsIndex === "0" ? { index: false, follow: false } : undefined,
    verification: settings.gscVerification
      ? { google: settings.gscVerification }
      : undefined
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        {children}
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <SeoScripts />
      </body>
    </html>
  );
}
