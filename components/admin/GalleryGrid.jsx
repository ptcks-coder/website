"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 12;

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function isVideoUrl(url, mediaType) {
  if (mediaType === "VIDEO") return true;
  return /\.(mp4|webm|mov)(\?|$)/i.test(String(url || ""));
}

export default function GalleryGrid({ role }) {
  const router = useRouter();
  const fileRef = useRef(null);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    caption: "",
    category: "Kegiatan",
    mediaType: "IMAGE",
    published: true,
    image: ""
  });
  const isAdmin = role === "ADMIN";

  const load = useCallback(async () => {
    setError("");
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    if (mediaType) params.set("mediaType", mediaType);
    params.set("page", String(page));
    params.set("pageSize", String(PAGE_SIZE));
    try {
      const res = await fetch(`/api/admin/gallery?${params.toString()}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal memuat");
      setData(json);
    } catch (e) {
      setError(e.message);
    }
  }, [q, category, mediaType, page]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [q, category, mediaType]);

  async function remove(id) {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d.error || "Hapus gagal");
        return;
      }
      await load();
      router.refresh();
    } finally {
      setBusy(0);
    }
  }

  async function uploadFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.url) throw new Error(json.error || "Upload gagal");
      const isVid = file.type.startsWith("video/") || /\.mp4$/i.test(file.name);
      setForm((f) => ({
        ...f,
        image: json.url,
        mediaType: isVid ? "VIDEO" : f.mediaType || "IMAGE",
        title: f.title || file.name.replace(/\.[^.]+$/, "")
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function submitForm(e) {
    e.preventDefault();
    if (!form.image) {
      setError("Unggah file terlebih dahulu.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan");
      setShowForm(false);
      setForm({
        title: "",
        caption: "",
        category: "Kegiatan",
        mediaType: "IMAGE",
        published: true,
        image: ""
      });
      setPage(1);
      await load();
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  const categories = (data?.categories || []).map((c) => c.category).filter(Boolean);
  const totalPages = Math.max(1, Math.ceil((data?.total || 0) / PAGE_SIZE));

  return (
    <div className="space-y-4">
      {/* Toolbar satu baris: ck-input punya w-full, jadi pakai !w-* + shrink-0 */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          className="ck-input !w-36 shrink-0 sm:!w-40"
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          aria-label="Filter tipe"
        >
          <option value="">Semua tipe</option>
          <option value="IMAGE">Gambar</option>
          <option value="VIDEO">Video short</option>
        </select>
        <select
          className="ck-input !w-40 shrink-0 sm:!w-44"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter kategori"
        >
          <option value="">Semua kategori</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          className="ck-input !w-48 min-w-0 shrink sm:!w-56"
          placeholder="Cari galeri…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Cari galeri"
        />
        <button
          type="button"
          className="ck-btn-primary ml-auto shrink-0"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Tutup form" : "+ Tambah media"}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={submitForm} className="ck-card grid gap-4 sm:grid-cols-2">
          <div>
            <label className="ck-label">Tipe upload</label>
            <select
              className="ck-input"
              value={form.mediaType}
              onChange={(e) => setForm((f) => ({ ...f, mediaType: e.target.value }))}
            >
              <option value="IMAGE">Gambar (foto)</option>
              <option value="VIDEO">Video short (mp4)</option>
            </select>
          </div>
          <div>
            <label className="ck-label">Kategori</label>
            <input
              className="ck-input"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="Kegiatan"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="ck-label">Judul</label>
            <input
              className="ck-input"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Judul media…"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="ck-label">Caption</label>
            <textarea
              className="ck-input"
              rows={2}
              value={form.caption}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="ck-label">File</label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="ck-btn-secondary"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? "Mengunggah…" : form.mediaType === "VIDEO" ? "Pilih video mp4" : "Pilih gambar"}
              </button>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept={form.mediaType === "VIDEO" ? "video/mp4,video/*" : "image/*"}
                onChange={uploadFile}
              />
              {form.image ? (
                <span className="font-mono text-xs text-emerald-700">{form.image}</span>
              ) : (
                <span className="text-xs text-gray-400">Belum ada file</span>
              )}
            </div>
            {form.image ? (
              <div className="mt-3 max-w-xs overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                {isVideoUrl(form.image, form.mediaType) ? (
                  <video src={form.image} className="aspect-video w-full object-cover" controls muted playsInline />
                ) : (
                  <img src={form.image} alt="Pratinjau" className="aspect-video w-full object-cover" />
                )}
              </div>
            ) : null}
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            />
            Tampilkan di website
          </label>
          <div className="flex justify-end">
            <button type="submit" className="ck-btn-primary" disabled={uploading}>
              {uploading ? "Menyimpan…" : "Simpan ke galeri"}
            </button>
          </div>
        </form>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="ck-card p-5">
        {data?.items?.length === 0 ? (
          <p className="py-10 text-center text-gray-400">
            Tidak ada media.{" "}
            <button type="button" className="text-blue-600 hover:underline" onClick={() => setShowForm(true)}>
              Tambah media pertama →
            </button>
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(data?.items || []).map((item) => {
              const video = isVideoUrl(item.image, item.mediaType);
              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {video ? (
                      <video
                        src={item.image}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {video ? "Video" : "Gambar"}
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="truncate font-medium text-gray-900">{item.title}</h4>
                        <p className="text-xs text-gray-500">
                          {item.category || "—"} · {fmtDate(item.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.published ? "Terbit" : "Draft"}
                      </span>
                    </div>
                    {item.caption ? <p className="mt-2 line-clamp-2 text-xs text-gray-600">{item.caption}</p> : null}
                    <div className="mt-3 flex items-center gap-1.5">
                      {item.published ? (
                        <a href="/galeri" target="_blank" rel="noreferrer" className="ck-btn-secondary px-2 py-1 text-xs">
                          Lihat
                        </a>
                      ) : null}
                      {isAdmin ? (
                        <button
                          type="button"
                          className="ck-btn-danger px-2 py-1 text-xs"
                          disabled={busy === item.id}
                          onClick={() => {
                            if (window.confirm(`Hapus "${item.title}"?`)) remove(item.id);
                          }}
                        >
                          Hapus
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {data && data.total > PAGE_SIZE ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500">
              Halaman {page} dari {totalPages} · {data.total} item
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="ck-btn-secondary px-3 py-1.5 text-xs"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Sebelumnya
              </button>
              <button
                type="button"
                className="ck-btn-secondary px-3 py-1.5 text-xs"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Berikutnya →
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
