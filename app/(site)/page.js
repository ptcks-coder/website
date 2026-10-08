import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import { COMPANY, FAQ_ITEMS } from "@/data/site";
import { getLowonganImage, getBlogImage, DEMO_IMAGES } from "@/lib/demo-images";
import { getPublishedPosts, getActiveJobs, getEvents, getHeroSlides } from "@/lib/queries";

export const dynamic = "force-dynamic";

function fmtDate(iso) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(iso));
}

export default async function HomePage() {
  const [jobs, posts, events, heroSlides] = await Promise.all([
    getActiveJobs(),
    getPublishedPosts(3),
    getEvents({ upcomingOnly: true, limit: 3 }),
    getHeroSlides()
  ]);

  return (
    <>
      <HeroSlider slides={heroSlides} />

      <section className="section" id="lowongan">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Informasi lowongan</h2>
              <p>
                Ringkasan negara dan posisi yang umum di penempatan CPMI. Detail dikonfirmasi saat
                proses daftar.
              </p>
            </div>
            <Link href="/lowongan" className="btn btn-secondary">
              Semua lowongan
            </Link>
          </div>
          <div className="job-grid">
            {jobs.slice(0, 3).map((job) => (
              <article key={job.id} className="job-card">
                <div className="job-card-media">
                  <img
                    src={job.image || getLowonganImage(job.kode?.toLowerCase())}
                    alt={`${job.posisi} — ${job.negara}`}
                    width={600}
                    height={360}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="job-card-body">
                  <div className="job-card-top">
                    <span className="job-flag">{job.kode}</span>
                    <span className="job-negara">{job.negara}</span>
                  </div>
                  <h3>{job.posisi}</h3>
                  <p>{job.info}</p>
                  <Link href="/daftar" className="btn btn-primary btn-sm">
                    Daftar CPMI
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container about-strip">
          <div>
            <h2>Tentang {COMPANY.brand}</h2>
            <p>
              {COMPANY.legalName} bergerak di bidang penempatan CPMI: pendaftaran, administrasi
              biodata, serta tahapan operasional hingga pelatihan di BLK. Profil lengkap tersedia di
              halaman perusahaan.
            </p>
            <Link href="/profil" className="btn btn-secondary">
              Lihat profil
            </Link>
          </div>
          <ul className="about-points">
            {COMPANY.services.map((item) => (
              <li key={item.title}>{item.title}</li>
            ))}
          </ul>
        </div>
      </section>

      {events.length ? (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Event mendatang</h2>
                <p>Sosialisasi, pembukaan kelas, dan kegiatan terdekat di CKS.</p>
              </div>
              <Link href="/event" className="btn btn-secondary">
                Semua event
              </Link>
            </div>
            <div className="event-grid">
              {events.map((event) => (
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
                    <span className="event-badge">Akan datang</span>
                    <h3>{event.title}</h3>
                    <div className="event-meta">
                      <span>{fmtDate(event.startAt)}</span>
                      {event.location ? <span>{event.location}</span> : null}
                    </div>
                    {event.description ? (
                      <p>
                        {event.description.slice(0, 120)}
                        {event.description.length > 120 ? "…" : ""}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={`section${events.length ? " section-alt" : ""}`}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Pertanyaan singkat</h2>
              <p>Jawaban umum seputar pendaftaran dan proses di CKS.</p>
            </div>
          </div>
          <div className="faq-list">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {posts.length ? (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Artikel terbaru</h2>
                <p>Informasi praktis seputar dokumen, BLK, dan proses penempatan.</p>
              </div>
              <Link href="/blog" className="btn btn-secondary">
                Semua artikel
              </Link>
            </div>
            <div className="blog-grid compact">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                  <div className="blog-card-media">
                    <img
                      src={post.featuredImage || getBlogImage(post.slug)}
                      alt=""
                      width={640}
                      height={360}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="blog-card-body">
                    <span className="meta">{fmtDate(post.publishedAt || post.createdAt)}</span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <span className="read-more">Baca selengkapnya →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
