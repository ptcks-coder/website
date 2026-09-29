import Link from "next/link";
import { COMPANY } from "@/data/site";
import { DEMO_IMAGES } from "@/lib/demo-images";
import { getBranches } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cabang"
};

export default async function CabangPage() {
  const branches = await getBranches();

  return (
    <>
      <section className="page-banner">
        <img
          src={DEMO_IMAGES.profil}
          alt="Cabang operasional"
          className="page-banner-photo"
          width={1600}
          height={640}
          decoding="async"
        />
        <div className="page-banner-overlay" aria-hidden="true" />
        <div className="container page-banner-inner">
          <p className="page-banner-eyebrow">{COMPANY.brand}</p>
          <h1>Cabang</h1>
          <p>Daftar cabang operasional CKS yang aktif.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Cabang aktif</h2>
              <p>Nama, kode, dan kontak cabang yang terdaftar.</p>
            </div>
            <Link href="/kontak" className="btn btn-secondary">
              Halaman kontak
            </Link>
          </div>
          <div className="cabang-grid">
            {branches.map((cabang) => (
              <article key={cabang.kode} className="cabang-card">
                <span className="cabang-kode">{cabang.kode}</span>
                <h3>{cabang.nama}</h3>
                <p>{cabang.alamat || "Alamat menyusul"}</p>
                {cabang.telepon ? <p>{cabang.telepon}</p> : null}
              </article>
            ))}
          </div>
          {branches.length === 0 ? (
            <p className="kontak-note">Belum ada cabang yang ditampilkan.</p>
          ) : null}
        </div>
      </section>
    </>
  );
}
