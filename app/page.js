import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import { COMPANY, BLOG_POSTS, LOWONGAN_CONTOH, FAQ_ITEMS } from "@/data/site";
import { getLowonganImage, getBlogImage } from "@/lib/demo-images";

export default function HomePage() {
  return (
    <>
      <HeroSlider />

      <section className="section" id="lowongan">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Informasi lowongan</h2>
              <p>
                Ringkasan negara dan posisi yang umum di penempatan CPMI. Bukan klaim slot resmi
                tersisa — detail dikonfirmasi saat proses daftar.
              </p>
            </div>
            <Link href="/lowongan" className="btn btn-secondary">
              Semua lowongan
            </Link>
          </div>
          <div className="job-grid">
            {LOWONGAN_CONTOH.slice(0, 3).map((job) => (
              <article key={job.id} className="job-card">
                <div className="job-card-media">
                  <img
                    src={getLowonganImage(job.id)}
                    alt={`${job.posisi} — ${job.negara} (contoh)`}
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
              biodata, serta tahapan operasional hingga pelatihan di BLK. Profil lengkap tersedia
              di halaman perusahaan.
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

      <section className="section">
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

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Artikel terbaru</h2>
              <p>Informasi praktis seputar dokumen, BLK, dan izin pulang secara umum.</p>
            </div>
            <Link href="/blog" className="btn btn-secondary">
              Semua artikel
            </Link>
          </div>
          <div className="blog-grid compact">
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                <div className="blog-card-media">
                  <img
                    src={getBlogImage(post.slug)}
                    alt=""
                    width={640}
                    height={360}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="blog-card-body">
                  <span className="meta">{post.date}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="read-more">Baca selengkapnya →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
