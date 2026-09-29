import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function robots() {
  const settings = await getSettings();
  const allow = settings.robotsIndex !== "0";
  return {
    rules: [
      {
        userAgent: "*",
        allow: allow ? "/" : undefined,
        disallow: allow ? ["/admin", "/api"] : "/"
      }
    ],
    sitemap: process.env.SITE_URL ? `${process.env.SITE_URL}/sitemap.xml` : undefined
  };
}
