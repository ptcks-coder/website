import Link from "next/link";
import { COMPANY, CABANG_LIST } from "@/data/site";
import { DEMO_IMAGES } from "@/lib/demo-images";

export const metadata = {
  title: "Cabang"
};

export default function CabangPage() {
  return (
    <>
      <section className="page-banner">
        <img
          src={DEMO_IMAGES.profil}
          alt="Cabang operasional (foto demo)"
          className="page-banner-photo"
          width={1600}
          height={640}
          decoding="async"
        />
        <div className="page-banner-overlay" aria-hidden="true" />
        <div className="container page-banner-inner">
          <p className="page-banner-eyebrow">{COMPANY.brand}</p>
          <h1>Cabang</h1>
          <p>
            Daftar nama cabang aktif dari data operasional. Alamat dan telepon tidak ditampilkan
            bila belum tersedia.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Cabang aktif</h2>
              <p>Hanya nama dan kode cabang — tanpa mengarang alamat atau kontak.</p>
            </div>
            <Link href="/kontak" className="btn btn-secondary">
              Halaman kontak
            </Link>
          </div>
          <div className="cabang-grid">
            {CABANG_LIST.map((cabang) => (
              <article key={cabang.kode} className="cabang-card">
                <span className="cabang-kode">{cabang.kode}</span>
                <h3>{cabang.nama}</h3>
                <p>Alamat belum dilengkapi</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
