import { COMPANY, GALERI_ITEMS } from "@/data/site";
import { DEMO_IMAGES } from "@/lib/demo-images";

export const metadata = {
  title: "Galeri"
};

export default function GaleriPage() {
  return (
    <>
      <section className="page-banner">
        <img
          src={DEMO_IMAGES.blog["apa-itu-blk"]}
          alt="Galeri foto ilustrasi"
          className="page-banner-photo"
          width={1600}
          height={640}
          decoding="async"
        />
        <div className="page-banner-overlay" aria-hidden="true" />
        <div className="container page-banner-inner">
          <p className="page-banner-eyebrow">{COMPANY.brand}</p>
          <h1>Galeri</h1>
          <p>
            Kumpulan foto ilustrasi dari aset demo lokal. Bukan dokumentasi peserta CKS sungguhan.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Foto ilustrasi</h2>
              <p>Semua gambar dilabeli sebagai ilustrasi; tidak mengklaim identitas peserta.</p>
            </div>
          </div>
          <div className="galeri-grid">
            {GALERI_ITEMS.map((item) => (
              <figure key={item.src} className="galeri-item">
                <img
                  src={item.src}
                  alt={item.caption}
                  width={640}
                  height={400}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
