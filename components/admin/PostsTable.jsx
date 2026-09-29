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
        <div className="flex flex-wrap items-center gap-1 text-sm">
          {TABS.map((t) => {
            const count = t.key ? counts[t.key] || 0 : total;
            const active = status === t.key;
            return (
              <Link
                key={t.key}
                href={t.key ? `/admin/posts?status=${t.key}` : "/admin/posts"}
                className={`rounded-md px-3 py-1.5 font-medium ${
                  active ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {t.label} <span className="opacity-70">({count})</span>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <input
            className="ck-input w-56"
            placeholder="Cari judul…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Link href="/admin/posts/new" className="ck-btn-primary">
            + Artikel baru
          </Link>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="ck-card overflow-x-auto p-0">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Judul</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Penulis</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Kategori</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Tanggal</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(data?.posts || []).map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/posts/${p.id}`}
                    className="font-medium text-gray-900 hover:text-blue-700"
                  >
                    {p.title}
                  </Link>
                  <span className="block text-xs text-gray-400">/blog/{p.slug}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.author?.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {p.categories.map((c) => c.name).join(", ") || "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`ck-badge ${STATUS_CLASS[p.status]}`}>{STATUS_LABEL[p.status]}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{fmtDate(p.publishedAt || p.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5 text-xs">
                    <Link href={`/admin/posts/${p.id}`} className="ck-btn-secondary px-2 py-1">
                      Edit
                    </Link>
                    {p.status === "PUBLISHED" ? (
                      <Link
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        className="ck-btn-secondary px-2 py-1"
                      >
                        Lihat
                      </Link>
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
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  Tidak ada artikel.{" "}
                  <Link href="/admin/posts/new" className="text-blue-600 hover:underline">
                    Tulis artikel pertama →
                  </Link>
                </td>
              </tr>
            ) : null}
            {!data && !error ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
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
