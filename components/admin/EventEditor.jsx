"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

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
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const longDescRef = useRef(event?.longDescriptionJson || null);
  const fileRef = useRef(null);

  const effectiveSlug = slugTouched ? slug : slugifyLocal(title);

  const onEditorUpdate = useCallback((json) => {
    longDescRef.current = json;
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

  return (
    <div className="space-y-4">
      {message ? (
        <div
          className={`rounded-md px-3 py-2 text-sm ${
            message.type === "ok" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-red-50 text-red-700 ring-1 ring-red-200"
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="ck-card space-y-4">
            <Field label="Judul Event">
              <input
                className="ck-input text-lg font-semibold"
                placeholder="Nama event…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>
            <Field label="Slug (URL)" hint={`/event/${effectiveSlug || "…"}`}>
              <input
                className="ck-input font-mono text-xs"
                value={effectiveSlug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
              />
            </Field>
          </div>

          <div className="ck-card">
            <Field label="Deskripsi Singkat" hint="Tampil di daftar event & meta." />
            <textarea
              className="ck-input"
              rows={4}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Ringkasan singkat event…"
            />
          </div>

          <div className="ck-card">
            <label className="ck-label">Deskripsi Lengkap</label>
            <p className="mb-2 text-xs text-gray-400">Gunakan editor di bawah — ketik “/” untuk perintah.</p>
            <NovelEditor initialContent={event?.longDescriptionJson || null} onUpdate={onEditorUpdate} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="ck-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Publikasi</h3>
              <span className={`ck-badge ${published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                {published ? "Terbit" : "Draft"}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="ck-btn-primary"
                disabled={saving}
                onClick={save}
              >
                {saving ? "Menyimpan…" : "Simpan"}
              </button>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                Tampilkan di website
              </label>
            </div>
          </div>

          <div className="ck-card space-y-3">
            <Field label="Waktu Mulai">
              <input
                type="datetime-local"
                className="ck-input"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
              />
            </Field>
            <Field label="Waktu Selesai (opsional)" hint="Kosongkan bila acara seharian." />
            <input
              type="datetime-local"
              className="ck-input"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
            <Field label="Lokasi">
              <input
                className="ck-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Kantor Pusat CKS — Malang"
              />
            </Field>
          </div>

          <div className="ck-card">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Gambar Event</h3>
            {image ? (
              <div className="space-y-2">
                <img src={image} alt="Gambar event" className="aspect-video w-full rounded-md object-cover" />
                <button
                  type="button"
                  className="ck-btn-danger w-full"
                  onClick={() => setImage("")}
                >
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
            <p className="mt-2 text-xs text-gray-400">Atau tempel URL gambar:</p>
            <input
              className="ck-input mt-1 font-mono text-xs"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/media/… atau https://…"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
