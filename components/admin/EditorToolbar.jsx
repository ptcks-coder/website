"use client";

import { useEffect, useReducer, useRef, useState } from "react";

/* Ikon ringkas (16px) */
const I = {
  bold: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />
    </svg>
  ),
  italic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M15 5h-6M15 19h-6M14 5 10 19" />
    </svg>
  ),
  underline: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M7 4v6a5 5 0 0 0 10 0V4M5 20h14" />
    </svg>
  ),
  strike: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 12h14M8 8a3.5 3.5 0 0 1 3.5-3h1A3.5 3.5 0 0 1 16 8M8 16a3.5 3.5 0 0 0 3.5 3h1A3.5 3.5 0 0 0 16 16" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8 8-4 4 4 4m8-8 4 4-4 4" />
    </svg>
  ),
  bullet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 6h12M9 12h12M9 18h12" />
      <circle cx="4.5" cy="6" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  ),
  ordered: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M10 6h11M10 12h11M10 18h11M4 5h1.5v4M4 9h2.5M4 13.5h2.5v1.5H4v1.5h2.5" />
    </svg>
  ),
  task: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="12" height="12" rx="2" />
      <path d="m6 11 2 2 4-4M16 8h5M16 12h5" />
    </svg>
  ),
  quote: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6" />
    </svg>
  ),
  codeBlock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m9 10-2 2 2 2m6-4 2 2-2 2" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M10 14a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1M14 10a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1" />
    </svg>
  ),
  image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 18 5-5 3 3 3-3 3 3" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path fill="currentColor" d="m10 9.5 5 2.5-5 2.5z" stroke="none" />
    </svg>
  ),
  undo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 7 4 12l5 5M4 12h11a5 5 0 0 1 0 10h-2" />
    </svg>
  ),
  redo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 7 5 5-5 5M20 12H9a5 5 0 0 0 0 10h2" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  math: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 4H6l6 8-6 8h12" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.6-8.7L1.7 2h6.8l4.7 6.2L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20Z" />
    </svg>
  ),
  color: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h12M8 15l4-10 4 10M9.5 11h5" />
    </svg>
  )
};

const TEXT_COLORS = [
  { name: "Default", color: null },
  { name: "Ungu", color: "#9333EA" },
  { name: "Merah", color: "#E00000" },
  { name: "Kuning", color: "#CA8A04" },
  { name: "Biru", color: "#2563EB" },
  { name: "Hijau", color: "#008A00" },
  { name: "Oranye", color: "#EA580C" },
  { name: "Pink", color: "#DB2777" },
  { name: "Abu", color: "#78716C" }
];

const HIGHLIGHT_COLORS = [
  { name: "Default", color: null },
  { name: "Ungu", color: "#E9D5FF" },
  { name: "Merah", color: "#FECACA" },
  { name: "Kuning", color: "#FEF08A" },
  { name: "Biru", color: "#BFDBFE" },
  { name: "Hijau", color: "#BBF7D0" },
  { name: "Oranye", color: "#FED7AA" },
  { name: "Pink", color: "#FBCFE8" },
  { name: "Abu", color: "#E5E7EB" }
];

function Btn({ active, disabled, title, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active || undefined}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`ck-tb-btn${active ? " is-active" : ""}`}
    >
      {children}
    </button>
  );
}

const Sep = () => <span className="ck-tb-sep" aria-hidden="true" />;

function ColorMenu({ editor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="ck-tb-group" ref={ref}>
      <Btn title="Warna & sorotan" active={open} onClick={() => setOpen((v) => !v)}>
        {I.color}
      </Btn>
      {open ? (
        <div className="ck-tb-menu ck-tb-menu-colors">
          <p className="ck-tb-menu-label">Warna teks</p>
          <div className="ck-tb-swatches">
            {TEXT_COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                className="ck-tb-swatch"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  if (c.color) editor.chain().focus().setColor(c.color).run();
                  setOpen(false);
                }}
              >
                <span style={{ color: c.color || "#111827" }}>A</span>
              </button>
            ))}
          </div>
          <p className="ck-tb-menu-label">Sorotan</p>
          <div className="ck-tb-swatches">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                className="ck-tb-swatch"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  if (c.color) editor.chain().focus().setHighlight({ color: c.color }).run();
                  setOpen(false);
                }}
              >
                <span
                  className={c.color ? "" : "ck-tb-swatch-empty"}
                  style={c.color ? { backgroundColor: c.color } : undefined}
                >
                  A
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function EditorToolbar({ editor, onInsertImage }) {
  const [, force] = useReducer((x) => x + 1, 0);
  const [insertOpen, setInsertOpen] = useState(false);
  const insertRef = useRef(null);

  useEffect(() => {
    if (!editor) return undefined;
    const update = () => force();
    editor.on("transaction", update);
    editor.on("selectionUpdate", update);
    editor.on("focus", update);
    editor.on("blur", update);
    return () => {
      editor.off("transaction", update);
      editor.off("selectionUpdate", update);
      editor.off("focus", update);
      editor.off("blur", update);
    };
  }, [editor]);

  useEffect(() => {
    function onDoc(e) {
      if (insertRef.current && !insertRef.current.contains(e.target)) setInsertOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!editor) {
    return (
      <div className="ck-toolbar">
        <span className="px-2 py-1 text-xs text-gray-400">Memuat editor…</span>
      </div>
    );
  }

  const c = () => editor.chain().focus();
  const blockValue = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
      ? "h2"
      : editor.isActive("heading", { level: 3 })
        ? "h3"
        : "paragraph";

  function setBlock(value) {
    if (value === "paragraph") c().setParagraph().run();
    else c().setHeading({ level: Number(value.slice(1)) }).run();
  }

  const insertItems = [
    { label: "Paragraf", run: () => c().setParagraph().run() },
    { label: "Judul 1", run: () => c().setHeading({ level: 1 }).run() },
    { label: "Judul 2", run: () => c().setHeading({ level: 2 }).run() },
    { label: "Judul 3", run: () => c().setHeading({ level: 3 }).run() },
    { label: "Daftar poin", run: () => c().toggleBulletList().run() },
    { label: "Daftar nomor", run: () => c().toggleOrderedList().run() },
    { label: "Daftar centang", run: () => c().toggleTaskList().run() },
    { label: "Kutipan", run: () => c().toggleBlockquote().run() },
    { label: "Blok kode", run: () => c().toggleCodeBlock().run() },
    { label: "Garis pemisah", run: () => c().setHorizontalRule().run() },
    { label: "Gambar", run: () => onInsertImage?.() },
    {
      label: "YouTube",
      run: () => {
        const url = window.prompt("Tempel URL video YouTube:");
        if (url) c().setYoutubeVideo({ src: url }).run();
      }
    },
    {
      label: "Twitter (X)",
      run: () => {
        const url = window.prompt("Tempel URL tweet (X):");
        if (url) c().setTweet({ src: url }).run();
      }
    },
    {
      label: "Rumus (LaTeX)",
      run: () => {
        const latex = window.prompt("Masukkan LaTeX (mis. E = mc^2):");
        if (latex) c().setLatex({ latex }).run();
      }
    }
  ];

  return (
    <div className="ck-toolbar" role="toolbar" aria-label="Toolbar editor">
      <div className="ck-tb-group" ref={insertRef}>
        <Btn title="Sisipkan blok" active={insertOpen} onClick={() => setInsertOpen((v) => !v)}>
          {I.plus}
        </Btn>
        {insertOpen ? (
          <div className="ck-tb-menu" role="menu">
            {insertItems.map((it) => (
              <button
                key={it.label}
                type="button"
                role="menuitem"
                className="ck-tb-menu-item"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  it.run();
                  setInsertOpen(false);
                }}
              >
                {it.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <select
        className="ck-tb-select"
        value={blockValue}
        onChange={(e) => setBlock(e.target.value)}
        title="Jenis blok"
        aria-label="Jenis blok"
      >
        <option value="paragraph">Paragraf</option>
        <option value="h1">Judul 1</option>
        <option value="h2">Judul 2</option>
        <option value="h3">Judul 3</option>
      </select>

      <Sep />
      <Btn title="Tebal" active={editor.isActive("bold")} onClick={() => c().toggleBold().run()}>
        {I.bold}
      </Btn>
      <Btn title="Miring" active={editor.isActive("italic")} onClick={() => c().toggleItalic().run()}>
        {I.italic}
      </Btn>
      <Btn title="Garis bawah" active={editor.isActive("underline")} onClick={() => c().toggleUnderline().run()}>
        {I.underline}
      </Btn>
      <Btn title="Coret" active={editor.isActive("strike")} onClick={() => c().toggleStrike().run()}>
        {I.strike}
      </Btn>
      <Btn title="Kode inline" active={editor.isActive("code")} onClick={() => c().toggleCode().run()}>
        {I.code}
      </Btn>

      <Sep />
      <Btn title="Daftar poin" active={editor.isActive("bulletList")} onClick={() => c().toggleBulletList().run()}>
        {I.bullet}
      </Btn>
      <Btn title="Daftar nomor" active={editor.isActive("orderedList")} onClick={() => c().toggleOrderedList().run()}>
        {I.ordered}
      </Btn>
      <Btn title="Daftar centang" active={editor.isActive("taskList")} onClick={() => c().toggleTaskList().run()}>
        {I.task}
      </Btn>
      <Btn title="Kutipan" active={editor.isActive("blockquote")} onClick={() => c().toggleBlockquote().run()}>
        {I.quote}
      </Btn>
      <Btn title="Blok kode" active={editor.isActive("codeBlock")} onClick={() => c().toggleCodeBlock().run()}>
        {I.codeBlock}
      </Btn>

      <Sep />
      <Btn
        title="Tautan"
        active={editor.isActive("link")}
        onClick={() => {
          const prev = editor.getAttributes("link").href;
          const url = window.prompt("URL tautan:", prev || "https://");
          if (url === null) return;
          if (url === "") c().unsetLink().run();
          else c().setLink({ href: url }).run();
        }}
      >
        {I.link}
      </Btn>
      <Btn title="Gambar" onClick={() => onInsertImage?.()}>
        {I.image}
      </Btn>
      <Btn
        title="YouTube"
        onClick={() => {
          const url = window.prompt("Tempel URL video YouTube:");
          if (url) c().setYoutubeVideo({ src: url }).run();
        }}
      >
        {I.youtube}
      </Btn>
      <Btn
        title="Rumus (LaTeX)"
        active={editor.isActive("math")}
        onClick={() => {
          if (editor.isActive("math")) {
            c().unsetLatex().run();
            return;
          }
          const { from, to } = editor.state.selection;
          const latex = editor.state.doc.textBetween(from, to);
          if (latex) {
            c().setLatex({ latex }).run();
          } else {
            const input = window.prompt("Masukkan LaTeX (mis. E = mc^2):");
            if (input) c().setLatex({ latex: input }).run();
          }
        }}
      >
        {I.math}
      </Btn>
      <Btn
        title="Twitter (X)"
        onClick={() => {
          const url = window.prompt("Tempel URL tweet (X):");
          if (url) c().setTweet({ src: url }).run();
        }}
      >
        {I.twitter}
      </Btn>
      <ColorMenu editor={editor} />

      <Sep />
      <Btn title="Urungkan" disabled={!editor.can().undo()} onClick={() => c().undo().run()}>
        {I.undo}
      </Btn>
      <Btn title="Ulangi" disabled={!editor.can().redo()} onClick={() => c().redo().run()}>
        {I.redo}
      </Btn>

      <span className="ck-tb-count" aria-hidden="true">
        {(() => {
          try {
            const words = editor.storage.characterCount.words();
            const chars = editor.storage.characterCount.characters();
            return `${words} kata · ${chars} karakter`;
          } catch {
            return "";
          }
        })()}
      </span>
    </div>
  );
}
