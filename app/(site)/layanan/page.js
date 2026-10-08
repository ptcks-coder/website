import Link from "next/link";
import AlurProses from "@/components/AlurProses";
import { COMPANY } from "@/data/site";
import { DEMO_IMAGES } from "@/lib/demo-images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Layanan",
  description:
    "Layanan CKS: pendampingan penempatan CPMI, pelatihan BLK, dan administrasi dokumen hingga keberangkatan.",
  path: "/layanan",
  image: DEMO_IMAGES.profil
});

export default function LayananPage() {
  return (
    <>
      <section className="page-banner">
        <img
          src={DEMO_IMAGES.profil}
          alt="Ilustrasi layanan penempatan (foto demo)"
          className="page-banner-photo"
          width={1600}
          height={640}
          decoding="async"
        />
        <div className="page-banner-overlay" aria-hidden="true" />
        <div className="container page-banner-inner">
          <p className="page-banner-eyebrow">{COMPANY.legalName}</p>
          <h1>Layanan</h1>
          <p>
            Penempatan CPMI, pelatihan BLK, dan administrasi dokumen — dengan alur langkah orisinal
            CKS.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Apa yang kami bantu</h2>
              <p>Tiga fokus operasional penempatan di lingkungan CKS.</p>
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

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Proses Penempatan Calon Pekerja Migran Indonesia (CPMI)</h2>
              <p>
                Infografis orisinal PT Citra Karya Sejati / CKS (biru–putih logo). Di layar sempit,
                geser horizontal untuk melihat seluruh diagram.
              </p>
            </div>
          </div>
          <AlurProses />
        </div>
      </section>

      <section className="section">
        <div className="container profil-cta">
          <div>
            <h2>Siap mulai?</h2>
            <p>
              Isi formulir minat di halaman Daftar CPMI. Detail syarat dan jadwal dikonfirmasi
              melalui proses internal.
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
