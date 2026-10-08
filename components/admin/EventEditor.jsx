"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import EditorShell from "@/components/admin/EditorShell";

const NovelEditor = dynamic(() => import("@/components/admin/NovelEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-gray-200 bg-white text-sm text-gray-400">
      Memuat editor…
    </div>
  )
});

function slugifyLocal(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

async function uploadImage(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.error || "Upload gagal");
  return data.url;
}

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="ck-label">{label}</label>
      {children}
      {hint ? <p className="mt-1 text-xs text-gray-400">{hint}</p> : null}
    </div>
  );
}

function SideSection({ title, children, defaultOpen = true }) {
  return (
    <details className="ck-side-section" open={defaultOpen}>
      <summary className="ck-side-section-head">
        <span>{title}</span>
        <svg viewBox="0 0 24 24" className="ck-side-chevron" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="ck-side-section-body">{children}</div>
    </details>
  );
}

export default function EventEditor({ event }) {
  const router = useRouter();
  const isNew = !event?.id;

  const [title, setTitle] = useState(event?.title || "");
  const [slug, setSlug] = useState(event?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(event?.slug));
  const [shortDescription, setShortDescription] = useState(event?.shortDescription || "");
  const [location, setLocation] = useState(event?.location || "");
  const [startAt, setStartAt] = useState(toLocalInput(event?.startAt));
  const [endAt, setEndAt] = useState(toLocalInput(event?.endAt));
  const [image, setImage] = useState(event?.image || "");
  const [published, setPublished] = useState(event?.published ?? true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const longDescRef = useRef(event?.longDescriptionJson || null);
  const longHtmlRef = useRef(event?.longDescriptionHtml || "");
  const fileRef = useRef(null);

  const effectiveSlug = slugTouched ? slug : slugifyLocal(title);

  const onEditorUpdate = useCallback((json, html) => {
    longDescRef.current = json;
    if (typeof html === "string") longHtmlRef.current = html;
  }, []);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        title,
        slug: effectiveSlug,
        shortDescription,
        longDescriptionJson: longDescRef.current,
        longDescriptionHtml: longHtmlRef.current,
        location,
        startAt,
        endAt,
        image: image || null,
        published
      };
      const res = await fetch(isNew ? "/api/admin/events" : `/api/admin/events/${event.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Gagal menyimpan." });
        return;
      }
      setMessage({ type: "ok", text: "Tersimpan." });
      if (isNew) {
        router.replace(`/admin/events/${data.id}`);
      } else {
        router.refresh();
      }
    } catch {
      setMessage({ type: "error", text: "Tidak dapat menghubungi server." });
    } finally {
      setSaving(false);
    }
  }

  async function pickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImage(url);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const actions = (
    <>
      {message ? (
        <span
          className={`hidden text-xs sm:inline ${
            message.type === "ok" ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {message.text}
        </span>
      ) : null}
      <button type="button" className="ck-btn-primary" disabled={saving} onClick={save}>
        {saving ? "Menyimpan…" : isNew ? "Terbitkan event" : "Perbarui"}
      </button>
    </>
  );

  const side = (
    <>
      <SideSection title="Status &amp; visibilitas">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Tampilkan di website
        </label>
        <span
          className={`ck-badge ${
            published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {published ? "Terbit" : "Draft"}
        </span>
      </SideSection>

      <SideSection title="Permalink">
        <input
          className="ck-input font-mono text-xs"
          value={effectiveSlug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          aria-label="Slug URL"
        />
        <p className="mt-1 break-all text-xs text-gray-400">/event/{effectiveSlug || "…"}</p>
      </SideSection>

      <SideSection title="Waktu &amp; lokasi">
        <Field label="Waktu mulai">
          <input
            type="datetime-local"
            className="ck-input"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
          />
        </Field>
        <Field label="Waktu selesai (opsional)">
          <input
            type="datetime-local"
            className="ck-input"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
          />
        </Field>
        <Field label="Lokasi">
          <input
            className="ck-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Kantor Pusat CKS — Malang"
          />
        </Field>
      </SideSection>

      <SideSection title="Gambar event">
        {image ? (
          <div className="space-y-2">
            <img src={image} alt="Gambar event" className="aspect-video w-full rounded-md object-cover" />
            <button type="button" className="ck-btn-danger w-full" onClick={() => setImage("")}>
              Hapus gambar
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="ck-btn-secondary w-full"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? "Mengunggah…" : "Unggah gambar"}
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickImage} />
        <input
          className="ck-input mt-2 font-mono text-xs"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="/media/… atau https://…"
          aria-label="URL gambar event"
        />
      </SideSection>
    </>
  );

  return (
    <EditorShell
      backHref="/admin/events"
      heading={isNew ? "Event baru" : "Edit event"}
      subheading={event ? `Dibuat ${new Date(event.createdAt).toLocaleString("id-ID")}` : "Belum disimpan"}
      actions={actions}
      panelOpen={panelOpen}
      onTogglePanel={() => setPanelOpen((v) => !v)}
      side={side}
    >
      <input
        className="ck-title-input"
        placeholder="Tambahkan judul event"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Judul event"
      />
      <p className="ck-permalink">
        Permalink: <span className="font-mono">/event/{effectiveSlug || "…"}</span>
      </p>

      <div className="ck-card">
        <Field label="Deskripsi singkat" hint="Tampil di daftar event & meta.">
          <textarea
            className="ck-input"
            rows={3}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Ringkasan singkat event…"
          />
        </Field>
      </div>

      <div className="mt-4">
        <p className="ck-label">Deskripsi lengkap</p>
        <NovelEditor initialContent={event?.longDescriptionJson || null} onUpdate={onEditorUpdate} />
      </div>
    </EditorShell>
  );
}
