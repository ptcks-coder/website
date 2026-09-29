"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** Pelacak kunjungan ringan — kirim pageview ke /api/track (kecuali area admin). */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const last = useRef(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const qs = searchParams?.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    if (last.current === path) return;
    last.current = path;

    const payload = JSON.stringify({ path, referrer: document.referrer || "" });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/track",
          new Blob([payload], { type: "application/json" })
        );
      } else {
        fetch("/api/track", {
          method: "POST",
          body: payload,
          headers: { "Content-Type": "application/json" },
          keepalive: true
        });
      }
    } catch {
      /* abaikan */
    }
  }, [pathname, searchParams]);

  return null;
}
