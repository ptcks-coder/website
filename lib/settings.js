import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { COMPANY } from "@/data/site";

export const SETTING_KEYS = {
  siteTitle: { section: "general", label: "Judul situs", default: `${COMPANY.brand} — ${COMPANY.legalName}` },
  tagline: { section: "general", label: "Tagline", default: COMPANY.tagline },
  metaDescription: { section: "general", label: "Deskripsi meta default", default: "" },
  address: { section: "kontak", label: "Alamat kantor", default: "" },
  phone: { section: "kontak", label: "Telepon kantor", default: "" },
  whatsapp: { section: "kontak", label: "Nomor WhatsApp", default: "" },
  email: { section: "kontak", label: "Email", default: "" },
  mapsEmbedUrl: { section: "kontak", label: "URL embed Google Maps", default: "" },
  workHours: { section: "kontak", label: "Jam kerja", default: "Senin–Jumat 08.00–16.00, Sabtu 08.00–12.00" },
  facebook: { section: "sosial", label: "Facebook", default: "" },
  instagram: { section: "sosial", label: "Instagram", default: "" },
  tiktok: { section: "sosial", label: "TikTok", default: "" },
  youtube: { section: "sosial", label: "YouTube", default: "" },
  gaMeasurementId: { section: "integrasi", label: "Google Analytics Measurement ID (G-XXXX)", default: "" },
  gscVerification: { section: "integrasi", label: "Google Search Console — kode verifikasi (meta tag)", default: "" },
  robotsIndex: { section: "integrasi", label: "Izinkan indeks mesin pencari", default: "1" }
};

const DEFAULTS = Object.fromEntries(
  Object.entries(SETTING_KEYS).map(([key, cfg]) => [key, cfg.default])
);

async function loadSettings() {
  try {
    const rows = await prisma.setting.findMany();
    const map = { ...DEFAULTS };
    for (const row of rows) {
      if (row.key in map || true) map[row.key] = row.value ?? "";
    }
    return map;
  } catch {
    return { ...DEFAULTS };
  }
}

export const getSettings = unstable_cache(loadSettings, ["site-settings"], {
  tags: ["settings"],
  revalidate: 3600
});

export async function getSetting(key) {
  const settings = await getSettings();
  return settings[key] ?? DEFAULTS[key] ?? "";
}
