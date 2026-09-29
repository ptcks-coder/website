import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/queries";
import { DEMO_IMAGES } from "@/lib/demo-images";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug).catch(() => null);
  if (!event) return { title: "Event" };
  return { title: event.title, description: event.shortDescription || undefined };
}

function fmtDate(iso) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(iso));
}

function fmtTime(iso) {
  return new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(
    new Date(iso)
  );
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event || !event.published) notFound();

  const isPast = new Date(event.endAt || event.startAt) < new Date();

  return (
    <article className="article-page">
      <div className="container article-layout">
        <Link href="/event" className="article-back">
          ← Kembali ke event
        </Link>

        <div className="article-cover">
          <img
            src={event.image || DEMO_IMAGES.profil}
            alt={event.title}
            width={1100}
            height={520}
            decoding="async"
          />
        </div>

        <header className="article-header event-detail-head">
          <span className={`event-badge${isPast ? " is-past" : ""}`}>
            {isPast ? "Event selesai" : "Event akan datang"}
          </span>
          <h1>{event.title}</h1>
          <div className="event-detail-meta">
            <span>
              📅 {fmtDate(event.startAt)} · {fmtTime(event.startAt)}
              {event.endAt ? `–${fmtTime(event.endAt)}` : ""} WIB
            </span>
            {event.location ? <span>📍 {event.location}</span> : null}
          </div>
        </header>

        {event.shortDescription ? (
          <p className="article-lead">{event.shortDescription}</p>
        ) : null}

        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: event.longDescriptionHtml || "" }}
        />

        <p className="article-footer-nav">
          <Link href="/event" className="btn btn-secondary">
            ← Semua event
          </Link>{" "}
          <Link href="/daftar" className="btn btn-primary">
            Daftar CPMI
          </Link>
        </p>
      </div>
    </article>
  );
}
