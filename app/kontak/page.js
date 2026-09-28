import { COMPANY } from "@/data/site";
import { DEMO_IMAGES } from "@/lib/demo-images";
import KontakForm from "@/components/KontakForm";

export const metadata = {
  title: "Kontak"
};

export default function KontakPage() {
  return (
    <>
      <section className="page-banner">
        <img
          src={DEMO_IMAGES.hero}
          alt="Halaman kontak (foto demo)"
          className="page-banner-photo"
          width={1600}
          height={640}
          decoding="async"
        />
        <div className="page-banner-overlay" aria-hidden="true" />
        <div className="container page-banner-inner">
          <p className="page-banner-eyebrow">{COMPANY.legalName}</p>
          <h1>Kontak</h1>
          <p>{COMPANY.contactNote}. Kirim pesan lewat formulir di bawah (tersimpan di perangkat Anda).</p>
        </div>
      </section>

      <section className="section">
        <div className="container kontak-layout">
          <aside className="kontak-aside">
            <h2>Kantor</h2>
            <p>
              <strong>{COMPANY.legalName}</strong>
            </p>
            <p className="kontak-note">{COMPANY.contactNote}</p>
            <p className="kontak-note">
              Nomor telepon, alamat lengkap, dan nomor izin tidak ditampilkan di sini sampai data
              resmi dilengkapi.
            </p>
          </aside>
          <div className="form-shell">
            <KontakForm />
          </div>
        </div>
      </section>
    </>
  );
}
