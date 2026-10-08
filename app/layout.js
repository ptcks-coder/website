import "./globals.css";
import { Suspense } from "react";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { COMPANY } from "@/data/site";
import { getSettings } from "@/lib/settings";
import { siteUrl, absoluteUrl, organizationJsonLd, jsonLdScript } from "@/lib/seo";
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

/** Kata kunci dasar situs (dipakai bila halaman tidak punya kata kunci sendiri). */
const DEFAULT_KEYWORDS = [
  "CPMI",
  "calon pekerja migran indonesia",
  "penempatan tenaga kerja",
  "pekerja migran",
  "lowongan luar negeri",
  "BLK",
  "pelatihan kerja",
  COMPANY.brand,
  COMPANY.legalName
];

export async function generateMetadata() {
  const settings = await getSettings();
  const title = settings.siteTitle || `${COMPANY.brand} — ${COMPANY.legalName}`;
  const description =
    settings.metaDescription || `${COMPANY.legalName} (${COMPANY.brand}) — ${COMPANY.tagline}`;
  const ogImage = absoluteUrl("/demo/hero.jpg");

  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: title,
      template: `%s | ${COMPANY.brand}`
    },
    description,
    keywords: DEFAULT_KEYWORDS,
    applicationName: COMPANY.brand,
    authors: [{ name: COMPANY.legalName }],
    creator: COMPANY.legalName,
    publisher: COMPANY.legalName,
    icons: {
      icon: "/logo-cks.png"
    },
    robots:
      settings.robotsIndex === "0"
        ? { index: false, follow: false }
        : { index: true, follow: true },
    verification: settings.gscVerification
      ? { google: settings.gscVerification }
      : undefined,
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: COMPANY.brand,
      title,
      description,
      url: siteUrl(),
      images: [{ url: ogImage, alt: title }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage]
    }
  };
}

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="id" suppressHydrationWarning className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        {children}
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <SeoScripts />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(organizationJsonLd(settings))}
        />
      </body>
    </html>
  );
}
