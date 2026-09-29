import Link from "next/link";
import { COMPANY, NAV_LINKS } from "@/data/site";
import { getSettings } from "@/lib/settings";

export default async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getSettings();

  const socials = [
    ["Facebook", settings.facebook],
    ["Instagram", settings.instagram],
    ["TikTok", settings.tiktok],
    ["YouTube", settings.youtube]
  ].filter(([, url]) => url);

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
            {settings.address ? <p className="footer-meta-note">{settings.address}</p> : null}
            {settings.phone ? <p className="footer-meta-note">Telp: {settings.phone}</p> : null}
            {settings.whatsapp ? (
              <p className="footer-meta-note">WhatsApp: {settings.whatsapp}</p>
            ) : null}
            {settings.email ? <p className="footer-meta-note">{settings.email}</p> : null}
            <p className="footer-meta-note">
              <Link href="/kontak">Kirim pesan lewat formulir</Link>
            </p>
          </div>

          <div className="footer-col">
            <h3>Jam kerja</h3>
            <p className="footer-meta-note">
              {settings.workHours || "Senin–Jumat 08.00–16.00, Sabtu 08.00–12.00"}
            </p>
            {socials.length ? (
              <>
                <h3 style={{ marginTop: "1rem" }}>Media sosial</h3>
                <div className="footer-links">
                  {socials.map(([label, url]) => (
                    <a key={label} href={url} target="_blank" rel="noreferrer">
                      {label}
                    </a>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
        <div className="footer-bottom">
          © {year} {COMPANY.legalName}. Situs informasi penempatan CPMI.
        </div>
      </div>
    </footer>
  );
}
