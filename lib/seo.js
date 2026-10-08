import { COMPANY } from "@/data/site";

/** URL dasar situs (dari env, tanpa garis miring di akhir). */
export function siteUrl() {
  return (process.env.SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
}

export function absoluteUrl(path = "") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl()}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Metadata SEO halaman: title, description, keywords, canonical,
 * Open Graph, dan Twitter Card.
 */
export function pageMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  keywords
}) {
  const url = absoluteUrl(path);
  const images = image
    ? [{ url: absoluteUrl(image), width: 1200, height: 630, alt: title || COMPANY.brand }]
    : undefined;

  return {
    title,
    description,
    keywords: keywords || undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: COMPANY.brand,
      locale: "id_ID",
      type,
      images,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors?.length ? { authors } : {})
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images ? images.map((i) => i.url) : undefined
    }
  };
}

/** Data terstruktur Organization (dipakai di semua halaman). */
export function organizationJsonLd(settings = {}) {
  const wa = String(settings.whatsapp || "").replace(/[^0-9]/g, "");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.legalName,
    alternateName: COMPANY.brand,
    url: siteUrl(),
    logo: absoluteUrl("/logo-cks.png"),
    description:
      settings.metaDescription || `${COMPANY.legalName} (${COMPANY.brand}) — ${COMPANY.tagline}`,
    ...(settings.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: settings.address,
            addressCountry: "ID"
          }
        }
      : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(wa
      ? {
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: `+${wa.startsWith("62") ? wa : `62${wa.replace(/^0/, "")}`}`,
              contactType: "customer service",
              areaServed: "ID",
              availableLanguage: ["id"]
            }
          ]
        }
      : {}),
    ...(settings.instagram || settings.facebook
      ? {
          sameAs: [settings.facebook, settings.instagram, settings.tiktok, settings.youtube].filter(
            Boolean
          )
        }
      : {})
  };
}

/** Data terstruktur Article untuk halaman detail blog. */
export function articleJsonLd({ post, image, url }) {
  const published = post.publishedAt || post.createdAt;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    image: image ? [absoluteUrl(image)] : undefined,
    datePublished: published ? new Date(published).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    author: post.author?.name ? { "@type": "Person", name: post.author.name } : undefined,
    publisher: {
      "@type": "Organization",
      name: COMPANY.legalName,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo-cks.png") }
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(url || `/blog/${post.slug}`) },
    ...(post.focusKeyword ? { keywords: post.focusKeyword } : {}),
    ...(post.categories?.length
      ? { articleSection: post.categories.map((c) => c.name).join(", ") }
      : {}),
    ...(post.tags?.length ? { about: post.tags.map((t) => t.name) } : {})
  };
}

/** Data terstruktur Event untuk halaman detail event. */
export function eventJsonLd(event) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.shortDescription || undefined,
    image: event.image ? [absoluteUrl(event.image)] : undefined,
    startDate: event.startAt ? new Date(event.startAt).toISOString() : undefined,
    endDate: event.endAt ? new Date(event.endAt).toISOString() : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(event.location ? { location: { "@type": "Place", name: event.location } } : {}),
    organizer: { "@type": "Organization", name: COMPANY.legalName, url: siteUrl() }
  };
}

/** Data terstruktur BreadcrumbList. */
export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path)
    }))
  };
}

/** Komponen bantu: tag <script type="application/ld+json">. */
export function jsonLdScript(data) {
  return { __html: JSON.stringify(data) };
}
