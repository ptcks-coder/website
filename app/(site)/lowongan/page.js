import Link from "next/link";
import { COMPANY } from "@/data/site";
import { getLowonganImage, DEMO_IMAGES } from "@/lib/demo-images";
import { getActiveJobs } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lowongan"
};

export default async function LowonganPage() {
  const jobs = await getActiveJobs();

  return (
    <>
      <section className="page-banner">
        <img
          src={DEMO_IMAGES.hero}
          alt="Ilustrasi lowongan"
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
            Informasi negara dan posisi. Ketersediaan aktual dikonfirmasi saat proses pendaftaran.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Informasi lowongan</h2>
              <p>
                Ringkasan negara dan posisi untuk gambaran umum; ketersediaan aktual mengikuti
                proses seleksi.
              </p>
            </div>
            <Link href="/daftar" className="btn btn-secondary">
              Daftar CPMI
            </Link>
          </div>
          {jobs.length === 0 ? (
            <p className="kontak-note">Belum ada lowongan aktif saat ini.</p>
          ) : (
            <div className="job-grid">
              {jobs.map((job) => (
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
          )}
        </div>
      </section>
    </>
  );
}
