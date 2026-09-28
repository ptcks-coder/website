"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPANY, NAV_LINKS } from "@/data/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Beranda CKS">
          <img src="/logo-cks.png" alt="Logo CKS" width={48} height={48} className="brand-logo" />
          <span className="brand-text">
            <strong>{COMPANY.brand}</strong>
            <span className="brand-legal">{COMPANY.legalName}</span>
          </span>
        </Link>

        <button
          type="button"
          className={`nav-toggle${open ? " is-open" : ""}`}
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="site-nav" className={`nav${open ? " is-open" : ""}`} aria-label="Navigasi utama">
          {NAV_LINKS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "active" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/daftar"
            className={`cta${pathname === "/daftar" || pathname.startsWith("/daftar/") ? " active" : ""}`}
          >
            Daftar
          </Link>
        </nav>
      </div>
    </header>
  );
}
