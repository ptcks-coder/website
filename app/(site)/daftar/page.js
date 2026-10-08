import DaftarForm from "@/components/DaftarForm";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pendaftaran online CPMI",
  description:
    "Formulir pendaftaran online CPMI di CKS. Isi data pribadi dan minat penempatan, petugas akan menindaklanjuti.",
  path: "/daftar"
});

export default function DaftarPage() {
  return (
    <>
      <section className="page-intro">
        <div className="container">
          <div className="section-head">
            <div>
              <h1 className="page-intro-title">Daftar CPMI</h1>
              <p>
                Isi formulir di bawah untuk mendaftar sebagai Calon Pekerja Migran Indonesia. Data
                dikirim ke server CKS dan ditampung sebagai pendaftaran online sampai ditindaklanjuti
                petugas (belum otomatis menjadi data TKI).
              </p>
            </div>
            <Link href="/lowongan" className="btn btn-secondary">
              Lihat informasi lowongan
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container form-shell">
          <DaftarForm />
        </div>
      </section>
    </>
  );
}
