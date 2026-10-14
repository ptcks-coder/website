"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const TABS = [
  { key: "", label: "Semua" },
  { key: "published", label: "Terbit" },
  { key: "draft", label: "Draft" }
];

const CalendarIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path strokeLinecap="round" d="M8 3v4M16 3v4M3 10h18" />
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
        <div className="ck-tabs">
          {TABS.map((t) => {
            const count =
              t.key === "published" ? counts["true"] : t.key === "draft" ? counts["false"] : total;
            const active = status === t.key;
            return (
              <Link
                key={t.key}
                href={t.key ? `/admin/events?status=${t.key}` : "/admin/events"}
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
            placeholder="Cari event…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Link href="/admin/events/new" className="ck-btn-primary shrink-0">
            + Event baru
          </Link>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="ck-card overflow-x-auto p-0">
        <table className="ck-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th className="!text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(data?.events || []).map((e) => (
              <tr key={e.id}>
                <td>
                  <Link
                    href={`/admin/events/${e.id}`}
                    className="font-medium text-gray-900 hover:text-blue-700"
                  >
                    {e.title}
                  </Link>
                  <span className="block text-xs text-gray-400">/event/{e.slug}</span>
                </td>
                <td className="text-gray-600">{e.location || "—"}</td>
                <td>
                  <span
                    className={`ck-badge ${
                      e.published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {e.published ? "Terbit" : "Draft"}
                  </span>
                </td>
                <td className="text-gray-500">{fmtDate(e.startAt)}</td>
                <td>
                  <div className="flex items-center justify-end gap-1.5 text-xs">
                    <Link href={`/admin/events/${e.id}`} className="ck-btn-secondary px-2 py-1">
                      Edit
                    </Link>
                    {e.published ? (
                      <a
                        href={`/event/${e.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ck-btn-secondary px-2 py-1"
                      >
                        Lihat
                      </a>
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
                <td colSpan={5}>
                  <div className="ck-empty">
                    <span className="ck-empty-icon">{CalendarIcon}</span>
                    <p className="ck-empty-title">Belum ada event</p>
                    <p className="ck-empty-desc">Jadwalkan kegiatan pertama Anda.</p>
                    <Link href="/admin/events/new" className="ck-btn-primary mt-2">
                      + Buat event
                    </Link>
                  </div>
                </td>
              </tr>
            ) : null}
            {!data && !error ? (
              <tr>
                <td colSpan={5} className="py-14 text-center text-sm text-gray-400">
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
