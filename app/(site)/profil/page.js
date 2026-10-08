import Link from "next/link";
import { COMPANY } from "@/data/site";
import { DEMO_IMAGES } from "@/lib/demo-images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Profil perusahaan",
  description:
    "Profil PT Citra Karya Sejati (CKS) — perusahaan penempatan CPMI: layanan, proses, dan negara tujuan penempatan.",
  path: "/profil",
  image: DEMO_IMAGES.profil
});

export default function ProfilPage() {
  return (
    <>
      <section className="page-banner">
        <img
          src={DEMO_IMAGES.profil}
          alt="Suasana kegiatan kantor (foto demo)"
          className="page-banner-photo"
          width={1600}
          height={640}
          decoding="async"
        />
        <div className="page-banner-overlay" aria-hidden="true" />
        <div className="container page-banner-inner">
          <p className="page-banner-eyebrow">{COMPANY.legalName}</p>
          <h1>Profil</h1>
          <p>
            Mengenal {COMPANY.brand} dan layanan penempatan CPMI yang dijalankan melalui sistem
            operasional perusahaan.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container profil-about">
          <div className="profil-about-copy">
            <h2>Tentang {COMPANY.brand}</h2>
            <p>
              {COMPANY.legalName} dikenal dengan nama operasional <strong>{COMPANY.brand}</strong>.
              Perusahaan bergerak di bidang penempatan Calon Pekerja Migran Indonesia (CPMI),
              mencakup pendaftaran, administrasi biodata, serta tahapan operasional hingga
              pelatihan di BLK.
            </p>
            <p>
              Situs ini menyediakan informasi umum dan formulir minat pendaftaran. Proses resmi
              mengikuti prosedur internal CKS dan ketentuan destinasi yang berlaku.
            </p>
          </div>
          <aside className="profil-about-aside">
            <p className="profil-aside-label">Nama operasional</p>
            <p className="profil-aside-value">{COMPANY.brand}</p>
            <p className="profil-aside-label">Nama resmi</p>
            <p className="profil-aside-value">{COMPANY.legalName}</p>
            <p className="profil-aside-note">{COMPANY.contactNote}</p>
          </aside>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Layanan</h2>
              <p>Fokus operasional penempatan, pelatihan, dan administrasi dokumen.</p>
            </div>
          </div>
          <div className="service-grid">
            {COMPANY.services.map((item) => (
              <article key={item.title} className="service-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container profil-cta">
          <div>
            <h2>Negara tujuan (umum)</h2>
            <p>
              Minat penempatan yang sering ditanyakan meliputi Taiwan, Hong Kong, Malaysia, dan
              Singapura — dengan posisi informal, caregiver, maupun sektor produksi/jasa.
              Ketersediaan dan syarat mengikuti mitra serta ketentuan yang berlaku pada saat proses.
            </p>
          </div>
          <Link href="/daftar" className="btn btn-primary">
            Daftar CPMI
          </Link>
        </div>
      </section>
    </>
  );
}
