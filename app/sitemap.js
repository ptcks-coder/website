import { getPublishedPosts, getEvents } from "@/lib/queries";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** Prioritas & frekuensi perubahan untuk halaman statis. */
const STATIC_PAGES = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/lowongan", priority: 0.9, changeFrequency: "daily" },
  { path: "/daftar", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  { path: "/event", priority: 0.8, changeFrequency: "weekly" },
  { path: "/profil", priority: 0.7, changeFrequency: "monthly" },
  { path: "/layanan", priority: 0.7, changeFrequency: "monthly" },
  { path: "/galeri", priority: 0.6, changeFrequency: "weekly" },
  { path: "/cabang", priority: 0.6, changeFrequency: "monthly" },
  { path: "/kontak", priority: 0.6, changeFrequency: "monthly" }
];

export default async function sitemap() {
  const base = siteUrl();
  const [posts, events] = await Promise.all([getPublishedPosts(), getEvents()]);
  const now = new Date();

  return [
    ...STATIC_PAGES.map((p) => ({
      url: `${base}${p.path}`,
      lastModified: now,
      changeFrequency: p.changeFrequency,
      priority: p.priority
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt || p.publishedAt || p.createdAt || now,
      changeFrequency: "monthly",
      priority: 0.7
    })),
    ...events.map((e) => ({
      url: `${base}/event/${e.slug}`,
      lastModified: e.createdAt || now,
      changeFrequency: "weekly",
      priority: 0.6
    }))
  ];
}
