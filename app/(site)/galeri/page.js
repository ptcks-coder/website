import { COMPANY } from "@/data/site";
import { DEMO_IMAGES } from "@/lib/demo-images";
import { getGalleryItems } from "@/lib/queries";
import GaleriGrid from "@/components/GaleriGrid";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Galeri",
  description:
    "Galeri foto dan video kegiatan CKS: sosialisasi, pelatihan BLK, dan dokumentasi operasional penempatan CPMI.",
  path: "/galeri",
  image: DEMO_IMAGES.blog["apa-itu-blk"]
});

export default async function GaleriPage() {
  const items = await getGalleryItems();

  return (
    <>
      <section className="page-banner">
        <img
          src={DEMO_IMAGES.blog["apa-itu-blk"]}
          alt="Galeri kegiatan"
          className="page-banner-photo"
          width={1600}
          height={640}
          decoding="async"
        />
        <div className="page-banner-overlay" aria-hidden="true" />
        <div className="container page-banner-inner">
          <p className="page-banner-eyebrow">{COMPANY.brand}</p>
          <h1>Galeri</h1>
          <p>Dokumentasi kegiatan dan suasana operasional CKS.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {items.length === 0 ? (
            <p className="kontak-note">Belum ada foto yang dipublikasikan.</p>
          ) : (
            <GaleriGrid items={items} />
          )}
        </div>
      </section>
    </>
  );
}
