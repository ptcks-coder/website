import Link from "next/link";
import { COMPANY, NAV_LINKS } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-col">
            <h3>Navigasi</h3>
            <div className="footer-links">
              {NAV_LINKS.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <Link href="/daftar">Daftar CPMI</Link>
            </div>
          </div>

          <div className="footer-col">
            <h3>Kontak</h3>
            <p>
              <strong>{COMPANY.legalName}</strong>
            </p>
            <p className="footer-meta-note">{COMPANY.contactNote}</p>
            <p className="footer-meta-note">
              <Link href="/kontak">Kirim pesan lewat formulir</Link>
            </p>
          </div>

          <div className="footer-col">
            <h3>Jam kerja</h3>
            <ul className="footer-hours">
              <li>
                <span>Senin–Jumat</span>
                <span>08.00–16.00</span>
              </li>
              <li>
                <span>Sabtu</span>
                <span>08.00–12.00</span>
              </li>
              <li>
                <span>Minggu</span>
                <span>Tutup</span>
              </li>
            </ul>
            <p className="footer-meta-note">
              Contoh jam operasional umum — dapat diganti sesuai kebijakan kantor.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          © {year} {COMPANY.legalName}. Situs informasi penempatan CPMI.
        </div>
      </div>
    </footer>
  );
}
