"use client";

import Link from "next/link";

const IconBack = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const IconClose = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
const IconGear = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
  </svg>
);

/**
 * Shell editor layar penuh ala WordPress: top bar aksi, kanvas editor di kiri,
 * panel detail di kanan. Tidak memakai sidebar admin.
 */
export default function EditorShell({
  backHref = "/admin",
  heading,
  subheading,
  actions,
  panelOpen,
  onTogglePanel,
  side,
  children
}) {
  return (
    <div className="ck-editor-page">
      <header className="ck-editor-bar">
        <div className="ck-editor-bar-left">
          <Link href={backHref} className="ck-tb-btn" title="Kembali" aria-label="Kembali">
            {IconBack}
          </Link>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">{heading}</p>
            {subheading ? <p className="truncate text-xs text-gray-400">{subheading}</p> : null}
          </div>
        </div>

        <div className="ck-editor-bar-right">
          {actions}
          <button
            type="button"
            className={`ck-tb-btn${panelOpen ? " is-active" : ""}`}
            onClick={onTogglePanel}
            title={panelOpen ? "Sembunyikan pengaturan" : "Tampilkan pengaturan"}
            aria-label="Pengaturan"
            aria-pressed={panelOpen}
          >
            {IconGear}
          </button>
        </div>
      </header>

      <div className="ck-editor-body">
        <main className="ck-editor-canvas">
          <div className="ck-canvas-inner">{children}</div>
        </main>

        {panelOpen ? (
          <aside className="ck-editor-side" aria-label="Pengaturan dokumen">
            <div className="ck-side-head">
              <span className="text-sm font-semibold text-gray-800">Dokumen</span>
              <button
                type="button"
                className="ck-tb-btn"
                onClick={onTogglePanel}
                title="Tutup panel"
                aria-label="Tutup panel"
              >
                {IconClose}
              </button>
            </div>
            <div className="ck-side-body">{side}</div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
