"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Sidebar NextAdmin memakai <a href> biasa, sehingga setiap klik menu memicu
 * full page reload (lambat). Komponen ini:
 *  1. Menangkap klik tautan internal /admin -> navigasi SPA (client router).
 *  2. Memetakan URL gaya NextAdmin ke URL bersih milik kita.
 *  3. Menandai item menu yang sedang aktif (karena halaman kustom tidak
 *     mengirim `resource` ke NextAdmin, highlight bawaan tidak jalan).
 */
const PATH_MAP = {
  "/admin/post": "/admin/posts",
  "/admin/event": "/admin/events",
  "/admin/galleryitem": "/admin/galeri"
};

function mapPath(href) {
  for (const [from, to] of Object.entries(PATH_MAP)) {
    if (href === from || href.startsWith(`${from}/`) || href.startsWith(`${from}?`)) {
      return to + href.slice(from.length);
    }
  }
  return href;
}

function normalize(path) {
  return String(path || "").split("?")[0].split("#")[0];
}

export default function AdminLinkInterceptor() {
  const router = useRouter();
  const pathname = usePathname();

  // 1 & 2. Navigasi SPA + normalisasi URL
  useEffect(() => {
    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = event.target.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/admin")) return;

      event.preventDefault();
      router.push(mapPath(href));
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  // 3. Tandai menu aktif sesuai URL
  useEffect(() => {
    function applyActive() {
      const sidebar = document.querySelector(
        '.next-admin__root [class~="bg-nextadmin-menu-background"]'
      );
      if (!sidebar) return false;
      // Hanya item di dalam <nav> (bukan tautan brand di atas menu)
      const nav = sidebar.querySelector("nav");
      if (!nav) return false;
      const current = normalize(pathname);
      nav.querySelectorAll('a[href^="/admin"]').forEach((a) => {
        const href = normalize(a.getAttribute("href"));
        a.classList.toggle("ck-nav-active", mapPath(href) === current);
      });
      return true;
    }

    applyActive();
    const timers = [setTimeout(applyActive, 80), setTimeout(applyActive, 400)];
    return () => timers.forEach(clearTimeout);
  }, [pathname]);

  return null;
}
