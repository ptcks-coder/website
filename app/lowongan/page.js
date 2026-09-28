import Link from "next/link";
import { COMPANY, LOWONGAN_CONTOH } from "@/data/site";
import { getLowonganImage, DEMO_IMAGES } from "@/lib/demo-images";

export const metadata = {
  title: "Lowongan"
};

export default function LowonganPage() {
  return (
    <>
      <section className="page-banner">
        <img
          src={DEMO_IMAGES.hero}
          alt="Ilustrasi lowongan (foto demo)"
          className="page-banner-photo"
          width={1600}
          height={640}
          decoding="async"
        />
        <div className="page-banner-overlay" aria-hidden="true" />
        <div className="container page-banner-inner">
          <p className="page-banner-eyebrow">{COMPANY.brand}</p>
          <h1>Lowongan</h1>
          <p>
            Informasi negara dan posisi. Bukan klaim slot resmi tersisa — detail dikonfirmasi saat
            pendaftaran.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Informasi lowongan</h2>
              <p>Ringkasan negara dan posisi untuk gambaran umum; ketersediaan aktual mengikuti proses seleksi.</p>
            </div>
            <Link href="/daftar" className="btn btn-secondary">
              Daftar CPMI
            </Link>
          </div>
          <div className="job-grid">
            {LOWONGAN_CONTOH.map((job) => (
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
    </>
  );
}
