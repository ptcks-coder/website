import { getPublishedPosts, getEvents } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const base = process.env.SITE_URL || "http://localhost:3000";

  const [posts, events] = await Promise.all([getPublishedPosts(), getEvents()]);

  const staticPages = ["", "/profil", "/layanan", "/lowongan", "/galeri", "/cabang", "/blog", "/event", "/kontak", "/daftar"].map(
    (p) => ({ url: `${base}${p}`, changeFrequency: "weekly" })
  );

  return [
    ...staticPages,
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly"
    })),
    ...events.map((e) => ({
      url: `${base}/event/${e.slug}`,
      lastModified: e.createdAt,
      changeFrequency: "weekly"
    }))
  ];
}
