"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const TABS = [
  { key: "", label: "Semua" },
  { key: "PUBLISHED", label: "Terbit" },
  { key: "PENDING", label: "Menunggu persetujuan" },
  { key: "DRAFT", label: "Draft" }
];

const STATUS_LABEL = { DRAFT: "Draft", PENDING: "Menunggu", PUBLISHED: "Terbit" };
const STATUS_CLASS = {
  DRAFT: "bg-gray-100 text-gray-600",
  PENDING: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700"
};

const DocIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 3h6l5 5v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
    />
    <path strokeLinecap="round" d="M14 3v5h5M9 13h6M9 17h4" />
  </svg>
);

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export default function PostsTable({ role }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "";
  const [q, setQ] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(0);

  const isAdmin = role === "ADMIN";

  const load = useCallback(async () => {
    setError("");
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q.trim()) params.set("q", q.trim());
    try {
      const res = await fetch(`/api/admin/posts?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal memuat");
      setData(json);
    } catch (e) {
      setError(e.message);
    }
  }, [status, q]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function act(id, action, method = "PUT") {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "DELETE" ? undefined : JSON.stringify({ action })
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d.error || "Aksi gagal");
        return;
      }
      await load();
      router.refresh();
    } finally {
      setBusy(0);
    }
  }

  const counts = {};
  let total = 0;
  for (const c of data?.counts || []) {
    counts[c.status] = c._count;
    total += c._count;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="ck-tabs">
          {TABS.map((t) => {
            const count = t.key ? counts[t.key] || 0 : total;
            const active = status === t.key;
            return (
              <Link
                key={t.key}
                href={t.key ? `/admin/posts?status=${t.key}` : "/admin/posts"}
                className={`ck-tab${active ? " is-active" : ""}`}
              >
                {t.label}
                <span className="ck-tab-count">{count}</span>
              </Link>
            );
          })}
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <input
            className="ck-input !w-full sm:!w-56"
            placeholder="Cari judul…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Link href="/admin/posts/new" className="ck-btn-primary shrink-0">
            + Artikel baru
          </Link>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="ck-card overflow-x-auto p-0">
        <table className="ck-table">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Penulis</th>
              <th>Kategori</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th className="!text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(data?.posts || []).map((p) => (
              <tr key={p.id}>
                <td>
                  <Link
                    href={`/admin/posts/${p.id}`}
                    className="font-medium text-gray-900 hover:text-blue-700"
                  >
                    {p.title}
                  </Link>
                  <span className="block text-xs text-gray-400">/blog/{p.slug}</span>
                </td>
                <td className="text-gray-600">{p.author?.name}</td>
                <td className="text-gray-600">
                  {p.categories.map((c) => c.name).join(", ") || "—"}
                </td>
                <td>
                  <span className={`ck-badge ${STATUS_CLASS[p.status]}`}>{STATUS_LABEL[p.status]}</span>
                </td>
                <td className="text-gray-500">{fmtDate(p.publishedAt || p.updatedAt)}</td>
                <td>
                  <div className="flex items-center justify-end gap-1.5 text-xs">
                    <Link href={`/admin/posts/${p.id}`} className="ck-btn-secondary px-2 py-1">
                      Edit
                    </Link>
                    {p.status === "PUBLISHED" ? (
                      <a
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ck-btn-secondary px-2 py-1"
                      >
                        Lihat
                      </a>
                    ) : null}
                    {isAdmin && p.status === "PENDING" ? (
                      <button
                        className="ck-btn-success px-2 py-1"
                        disabled={busy === p.id}
                        onClick={() => act(p.id, "publish")}
                      >
                        Setujui
                      </button>
                    ) : null}
                    <button
                      className="ck-btn-danger px-2 py-1"
                      disabled={busy === p.id}
                      onClick={() => {
                        if (window.confirm(`Hapus artikel "${p.title}"?`)) act(p.id, null, "DELETE");
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data && data.posts.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="ck-empty">
                    <span className="ck-empty-icon">{DocIcon}</span>
                    <p className="ck-empty-title">Belum ada artikel</p>
                    <p className="ck-empty-desc">Mulai tulis artikel pertama Anda.</p>
                    <Link href="/admin/posts/new" className="ck-btn-primary mt-2">
                      + Tulis artikel
                    </Link>
                  </div>
                </td>
              </tr>
            ) : null}
            {!data && !error ? (
              <tr>
                <td colSpan={6} className="py-14 text-center text-sm text-gray-400">
                  Memuat…
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
