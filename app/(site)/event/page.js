import Link from "next/link";
import { COMPANY } from "@/data/site";
import { DEMO_IMAGES } from "@/lib/demo-images";
import { getEvents } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Event & Kegiatan"
};

function fmtDate(iso) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(iso));
}

function fmtTime(iso) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(iso));
}

const CalendarIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path strokeLinecap="round" d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);

const PinIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export default async function EventPage() {
  const events = await getEvents();
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.endAt || e.startAt) >= now);
  const past = events.filter((e) => new Date(e.endAt || e.startAt) < now);

  const renderCard = (event, isPast = false) => (
    <Link key={event.id} href={`/event/${event.slug}`} className="event-card">
      <div className="event-card-media">
        <img
          src={event.image || DEMO_IMAGES.profil}
          alt={event.title}
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="event-card-body">
        <span className={`event-badge${isPast ? " is-past" : ""}`}>
          {isPast ? "Selesai" : "Akan datang"}
        </span>
        <h3>{event.title}</h3>
        <div className="event-meta">
          <span>
            {CalendarIcon}
            {fmtDate(event.startAt)} · {fmtTime(event.startAt)} WIB
          </span>
          {event.location ? (
            <span>
              {PinIcon}
              {event.location}
            </span>
          ) : null}
        </div>
        {event.shortDescription ? <p>{event.shortDescription.slice(0, 140)}{event.shortDescription.length > 140 ? "…" : ""}</p> : null}
      </div>
    </Link>
  );

  return (
    <>
      <section className="page-banner">
        <img
          src={DEMO_IMAGES.profil}
          alt="Event dan kegiatan CKS"
          className="page-banner-photo"
          width={1600}
          height={640}
          decoding="async"
        />
        <div className="page-banner-overlay" aria-hidden="true" />
        <div className="container page-banner-inner">
          <p className="page-banner-eyebrow">{COMPANY.brand}</p>
          <h1>Event &amp; Kegiatan</h1>
          <p>Jadwal sosialisasi, pembukaan kelas, dan kegiatan lain di lingkungan CKS.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Akan datang</h2>
              <p>Event terdekat yang bisa Anda ikuti atau datangi.</p>
            </div>
            <Link href="/daftar" className="btn btn-secondary">
              Daftar CPMI
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="kontak-note">Belum ada event terjadwal — pantau halaman ini.</p>
          ) : (
            <div className="event-grid">{upcoming.map((e) => renderCard(e))}</div>
          )}
        </div>
      </section>

      {past.length ? (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Kegiatan sebelumnya</h2>
                <p>Arsip event yang sudah berlangsung.</p>
              </div>
            </div>
            <div className="event-grid">{past.map((e) => renderCard(e, true))}</div>
          </div>
        </section>
      ) : null}
    </>
  );
}
