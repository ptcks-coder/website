"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import EditorShell from "@/components/admin/EditorShell";

const NovelEditor = dynamic(() => import("@/components/admin/NovelEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-gray-200 bg-white text-sm text-gray-400">
      Memuat editor…
    </div>
  )
});

const STATUS_LABEL = { DRAFT: "Draft", PENDING: "Menunggu persetujuan", PUBLISHED: "Terbit" };
const STATUS_CLASS = {
  DRAFT: "bg-gray-100 text-gray-600",
  PENDING: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700"
};

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
  const [panelOpen, setPanelOpen] = useState(true);
  const [saving, setSaving] = useState("");
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const contentRef = useRef(post?.contentJson || null);
  const htmlRef = useRef(post?.contentHtml || "");
  const fileRef = useRef(null);

  const status = post?.status || "DRAFT";
  const effectiveSlug = slugTouched ? slug : slugifyLocal(title);

  const onEditorUpdate = useCallback((json, html) => {
    contentRef.current = json;
    if (typeof html === "string") htmlRef.current = html;
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
        contentHtml: htmlRef.current,
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
            ? "Menyimpan…"
            : status === "PUBLISHED"
              ? "Perbarui"
              : status === "PENDING"
                ? "Setujui & terbitkan"
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
    </>
  );

  const side = (
    <>
      <SideSection title="Status &amp; visibilitas">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-500">Status</span>
          <span className={`ck-badge ${STATUS_CLASS[status]}`}>{STATUS_LABEL[status]}</span>
        </div>
        {post?.publishedAt ? (
          <p className="text-xs text-gray-400">
            Terbit {new Date(post.publishedAt).toLocaleString("id-ID")}
          </p>
        ) : null}
        {status === "PUBLISHED" && canPublish ? (
          <button
            type="button"
            className="ck-btn-secondary w-full"
            disabled={Boolean(saving)}
            onClick={() => save("unpublish")}
          >
            Tarik ke draft
          </button>
        ) : null}
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
        <p className="mt-1 break-all text-xs text-gray-400">/blog/{effectiveSlug || "…"}</p>
      </SideSection>

      <SideSection title="Gambar utama">
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
        <input
          className="ck-input mt-2 font-mono text-xs"
          value={featuredImage}
          onChange={(e) => setFeaturedImage(e.target.value)}
          placeholder="/media/… atau https://…"
          aria-label="URL gambar utama"
        />
      </SideSection>

      <SideSection title="Kategori">
        <div className="space-y-1.5">
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
      </SideSection>

      <SideSection title="Tag">
        <div className="space-y-1.5">
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
      </SideSection>
    </>
  );

  return (
    <EditorShell
      backHref="/admin/posts"
      heading={isNew ? "Artikel baru" : "Edit artikel"}
      subheading={
        post
          ? `Terakhir diubah ${new Date(post.updatedAt).toLocaleString("id-ID")}`
          : "Belum disimpan"
      }
      actions={actions}
      panelOpen={panelOpen}
      onTogglePanel={() => setPanelOpen((v) => !v)}
      side={side}
    >
      <input
        className="ck-title-input"
        placeholder="Tambahkan judul"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Judul artikel"
      />
      <p className="ck-permalink">
        Permalink: <span className="font-mono">/blog/{effectiveSlug || "…"}</span>
      </p>

      <NovelEditor initialContent={post?.contentJson || null} onUpdate={onEditorUpdate} />

      <div className="ck-card mt-6">
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

      <div className="ck-card mt-4">
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
            <Field label="Deskripsi meta" hint={`${seoDescription.length}/160 karakter.`}>
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
    </EditorShell>
  );
}
