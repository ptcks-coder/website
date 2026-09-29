"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const TABS = [
  { key: "", label: "Semua" },
  { key: "published", label: "Terbit" },
  { key: "draft", label: "Draft" }
];

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export default function EventsTable({ role }) {
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
      const res = await fetch(`/api/admin/events?${params.toString()}`);
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

  async function remove(id) {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
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

  const counts = { true: 0, false: 0 };
  let total = 0;
  for (const c of data?.counts || []) {
    const key = c.published ? "true" : "false";
    counts[key] = c._count;
    total += c._count;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 text-sm">
          {TABS.map((t) => {
            const count = t.key === "published" ? counts["true"] : t.key === "draft" ? counts["false"] : total;
            const active = status === t.key;
            return (
              <Link
                key={t.key}
                href={t.key ? `/admin/events?status=${t.key}` : "/admin/events"}
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
            placeholder="Cari event…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Link href="/admin/events/new" className="ck-btn-primary">
            + Event baru
          </Link>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="ck-card overflow-x-auto p-0">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Event</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Lokasi</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Tanggal</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(data?.events || []).map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/events/${e.id}`} className="font-medium text-gray-900 hover:text-blue-700">
                    {e.title}
                  </Link>
                  <span className="block text-xs text-gray-400">/event/{e.slug}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{e.location || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`ck-badge ${e.published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                    {e.published ? "Terbit" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{fmtDate(e.startAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5 text-xs">
                    <Link href={`/admin/events/${e.id}`} className="ck-btn-secondary px-2 py-1">Edit</Link>
                    {e.published ? (
                      <Link href={`/event/${e.slug}`} target="_blank" className="ck-btn-secondary px-2 py-1">Lihat</Link>
                    ) : null}
                    {isAdmin ? (
                      <button
                        className="ck-btn-danger px-2 py-1"
                        disabled={busy === e.id}
                        onClick={() => {
                          if (window.confirm(`Hapus event "${e.title}"?`)) remove(e.id);
                        }}
                      >
                        Hapus
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {data && data.events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                  Tidak ada event.{" "}
                  <Link href="/admin/events/new" className="text-blue-600 hover:underline">Buat event pertama →</Link>
                </td>
              </tr>
            ) : null}
            {!data && !error ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400">Memuat…</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
