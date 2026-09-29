import { COMPANY } from "@/data/site";
import { DEMO_IMAGES } from "@/lib/demo-images";
import { getSettings } from "@/lib/settings";
import KontakForm from "@/components/KontakForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kontak"
};

function waLink(wa) {
  const num = String(wa || "").replace(/[^0-9]/g, "");
  if (!num) return null;
  return `https://wa.me/${num.startsWith("0") ? "62" + num.slice(1) : num}`;
}

export default async function KontakPage() {
  const settings = await getSettings();
  const wa = waLink(settings.whatsapp);
  const hasContact =
    settings.address || settings.phone || settings.whatsapp || settings.email;

  return (
    <>
      <section className="page-banner">
        <img
          src={DEMO_IMAGES.hero}
          alt="Halaman kontak"
          className="page-banner-photo"
          width={1600}
          height={640}
          decoding="async"
        />
        <div className="page-banner-overlay" aria-hidden="true" />
        <div className="container page-banner-inner">
          <p className="page-banner-eyebrow">{COMPANY.legalName}</p>
          <h1>Kontak</h1>
          <p>Hubungi kami atau kirim pesan lewat formulir — tim CKS siap membantu.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="kontak-cards">
            {settings.address ? (
              <div className="kontak-card">
                <span className="kontak-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
                    <circle cx="12" cy="10" r="2.6" />
                  </svg>
                </span>
                <h3>Alamat</h3>
                <p>{settings.address}</p>
              </div>
            ) : null}

            {settings.phone || wa ? (
              <div className="kontak-card">
                <span className="kontak-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                  </svg>
                </span>
                <h3>Telepon & WhatsApp</h3>
                {settings.phone ? <p>{settings.phone}</p> : null}
                {wa ? (
                  <p>
                    <a href={wa} target="_blank" rel="noreferrer" className="kontak-link">
                      Chat WhatsApp →
                    </a>
                  </p>
                ) : null}
              </div>
            ) : null}

            {settings.email ? (
              <div className="kontak-card">
                <span className="kontak-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
                  </svg>
                </span>
                <h3>Email</h3>
                <p>
                  <a href={`mailto:${settings.email}`} className="kontak-link">
                    {settings.email}
                  </a>
                </p>
              </div>
            ) : null}

            <div className="kontak-card">
              <span className="kontak-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" d="M12 7v5l3 3" />
                </svg>
              </span>
              <h3>Jam kerja</h3>
              <p>{settings.workHours || "Senin–Jumat 08.00–16.00"}</p>
            </div>
          </div>

          {!hasContact ? (
            <p className="kontak-note" style={{ marginBottom: "1.5rem" }}>
              Data kontak kantor belum dilengkapi — sementara ini gunakan formulir di bawah.
            </p>
          ) : null}

          <div className="kontak-layout">
            <div className="form-shell">
              <KontakForm />
            </div>
            <aside className="kontak-aside">
              {settings.mapsEmbedUrl ? (
                <div className="kontak-map">
                  <iframe
                    src={settings.mapsEmbedUrl}
                    title="Peta lokasi kantor"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              ) : null}
              <h2>Informasi</h2>
              <p>
                Untuk pertanyaan seputar pendaftaran CPMI, dokumen, atau jadwal pelatihan, kirim
                pesan lewat formulir. Cantumkan nama dan nomor yang bisa dihubungi agar petugas
                mudah menindaklanjuti.
              </p>
              <p className="kontak-note">
                Pendaftaran online sebagai calon peserta dilakukan lewat{" "}
                <a href="/daftar" className="kontak-link">
                  halaman Daftar CPMI
                </a>
                .
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
