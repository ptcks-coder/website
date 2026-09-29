"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const NovelEditor = dynamic(() => import("@/components/admin/NovelEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-gray-200 bg-white text-sm text-gray-400">
      Memuat editor…
    </div>
  )
});

const STATUS_LABEL = { DRAFT: "Draft", PENDING: "Menunggu persetujuan", PUBLISHED: "Terbit" };

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

export default function PostEditor({ post, categories, tags, role }) {
  const router = useRouter();
  const isAdmin = role === "ADMIN";
  const isNew = !post?.id;

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription || "");
  const [focusKeyword, setFocusKeyword] = useState(post?.focusKeyword || "");
  const [categoryIds, setCategoryIds] = useState(new Set(post?.categories?.map((c) => c.id) || []));
  const [tagIds, setTagIds] = useState(new Set(post?.tags?.map((t) => t.id) || []));
  const [seoOpen, setSeoOpen] = useState(Boolean(post?.seoTitle || post?.seoDescription));
  const [saving, setSaving] = useState("");
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const contentRef = useRef(post?.contentJson || null);
  const fileRef = useRef(null);

  const status = post?.status || "DRAFT";
  const effectiveSlug = slugTouched ? slug : slugifyLocal(title);

  const onEditorUpdate = useCallback((json) => {
    contentRef.current = json;
  }, []);

  function toggleSet(set, setter, id) {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  }

  async function save(action) {
    setSaving(action);
    setMessage(null);
    try {
      const payload = {
        title,
        slug: effectiveSlug,
        excerpt,
        contentJson: contentRef.current,
        featuredImage: featuredImage || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        focusKeyword: focusKeyword || null,
        categoryIds: [...categoryIds],
        tagIds: [...tagIds],
        action
      };
      const res = await fetch(isNew ? "/api/admin/posts" : `/api/admin/posts/${post.id}`, {
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
        router.replace(`/admin/posts/${data.id}`);
      } else {
        router.refresh();
      }
    } catch {
      setMessage({ type: "error", text: "Tidak dapat menghubungi server." });
    } finally {
      setSaving("");
    }
  }

  async function pickFeatured(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setFeaturedImage(url);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const canPublish = isAdmin;

  return (
    <div className="space-y-4">
      {message ? (
        <div
          className={`rounded-md px-3 py-2 text-sm ${
            message.type === "ok"
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-red-50 text-red-700 ring-1 ring-red-200"
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Kolom utama */}
        <div className="space-y-4">
          <div className="ck-card space-y-4">
            <Field label="Judul">
              <input
                className="ck-input text-lg font-semibold"
                placeholder="Tulis judul artikel…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>
            <Field label="Slug (URL)" hint={`/blog/${effectiveSlug || "…"}`}>
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
            <label className="ck-label">Isi artikel</label>
            <NovelEditor initialContent={post?.contentJson || null} onUpdate={onEditorUpdate} />
          </div>

          <div className="ck-card">
            <Field label="Kutipan / ringkasan (excerpt)">
              <textarea
                className="ck-input"
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Ringkasan singkat untuk daftar artikel & meta description…"
              />
            </Field>
          </div>

          {/* Panel SEO */}
          <div className="ck-card">
            <button
              type="button"
              onClick={() => setSeoOpen((v) => !v)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-sm font-semibold text-gray-800">
                Pengaturan SEO
                <span className="ml-2 text-xs font-normal text-gray-400">
                  judul meta, deskripsi, kata kunci fokus
                </span>
              </span>
              <span className="text-gray-400">{seoOpen ? "▾" : "▸"}</span>
            </button>
            {seoOpen ? (
              <div className="mt-4 space-y-4">
                <Field
                  label="Judul SEO"
                  hint={`${seoTitle.length}/60 karakter — kosongkan untuk memakai judul artikel.`}
                >
                  <input
                    className="ck-input"
                    maxLength={70}
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title || "Judul artikel"}
                  />
                </Field>
                <Field
                  label="Deskripsi meta"
                  hint={`${seoDescription.length}/160 karakter.`}
                >
                  <textarea
                    className="ck-input"
                    rows={3}
                    maxLength={200}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder={excerpt || "Ringkasan untuk hasil pencarian Google…"}
                  />
                </Field>
                <Field label="Kata kunci fokus">
                  <input
                    className="ck-input"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="mis. syarat cpmi taiwan"
                  />
                </Field>
                <div className="rounded-md bg-gray-50 p-3 ring-1 ring-gray-200">
                  <p className="text-xs font-medium text-gray-500">Pratinjau hasil pencarian</p>
                  <p className="mt-1 truncate text-sm text-blue-700">
                    {seoTitle || title || "Judul artikel"} | CKS
                  </p>
                  <p className="text-xs text-emerald-700">
                    {"situs-cks.id/blog/"}
                    {effectiveSlug || "…"}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                    {seoDescription || excerpt || "Deskripsi artikel akan tampil di sini…"}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Sidebar ala WordPress */}
        <div className="space-y-4">
          <div className="ck-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Publikasi</h3>
              <span
                className={`ck-badge ${
                  status === "PUBLISHED"
                    ? "bg-emerald-100 text-emerald-700"
                    : status === "PENDING"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {STATUS_LABEL[status]}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {isAdmin
                ? "Admin dapat menerbitkan langsung atau menyetujui artikel penulis."
                : "Artikel Anda akan ditinjau admin sebelum terbit."}
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="ck-btn-secondary"
                disabled={Boolean(saving)}
                onClick={() => save("draft")}
              >
                {saving === "draft" ? "Menyimpan…" : "Simpan draft"}
              </button>
              {canPublish ? (
                <button
                  type="button"
                  className="ck-btn-primary"
                  disabled={Boolean(saving)}
                  onClick={() => save("publish")}
                >
                  {saving === "publish"
                    ? "Menerbitkan…"
                    : status === "PUBLISHED"
                      ? "Perbarui"
                      : status === "PENDING"
                        ? "Setujui & Terbitkan"
                        : "Terbitkan"}
                </button>
              ) : (
                <button
                  type="button"
                  className="ck-btn-primary"
                  disabled={Boolean(saving)}
                  onClick={() => save("submit")}
                >
                  {saving === "submit" ? "Mengirim…" : "Kirim untuk ditinjau"}
                </button>
              )}
              {status === "PUBLISHED" && canPublish ? (
                <button
                  type="button"
                  className="ck-btn-secondary"
                  disabled={Boolean(saving)}
                  onClick={() => save("unpublish")}
                >
                  Tarik ke draft
                </button>
              ) : null}
            </div>
          </div>

          <div className="ck-card">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Gambar utama</h3>
            {featuredImage ? (
              <div className="space-y-2">
                <img
                  src={featuredImage}
                  alt="Gambar utama"
                  className="aspect-video w-full rounded-md object-cover"
                />
                <button
                  type="button"
                  className="ck-btn-danger w-full"
                  onClick={() => setFeaturedImage("")}
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
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickFeatured} />
            <p className="mt-2 text-xs text-gray-400">Atau tempel URL gambar:</p>
            <input
              className="ck-input mt-1 font-mono text-xs"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="/media/… atau https://…"
            />
          </div>

          <div className="ck-card">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Kategori</h3>
            <div className="max-h-40 space-y-1.5 overflow-y-auto">
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    checked={categoryIds.has(c.id)}
                    onChange={() => toggleSet(categoryIds, setCategoryIds, c.id)}
                  />
                  {c.name}
                </label>
              ))}
              {categories.length === 0 ? (
                <p className="text-xs text-gray-400">Belum ada kategori.</p>
              ) : null}
            </div>
          </div>

          <div className="ck-card">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Tag</h3>
            <div className="max-h-40 space-y-1.5 overflow-y-auto">
              {tags.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    checked={tagIds.has(t.id)}
                    onChange={() => toggleSet(tagIds, setTagIds, t.id)}
                  />
                  {t.name}
                </label>
              ))}
              {tags.length === 0 ? <p className="text-xs text-gray-400">Belum ada tag.</p> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
