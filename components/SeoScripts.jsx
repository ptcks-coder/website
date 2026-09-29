import Script from "next/script";
import { getSettings } from "@/lib/settings";

/** Injeksi Google Analytics (GA4) bila Measurement ID diisi di Pengaturan. */
export default async function SeoScripts() {
  const settings = await getSettings();
  const gaId = settings.gaMeasurementId?.trim();
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId.replace(/'/g, "")}');`}
      </Script>
    </>
  );
}
