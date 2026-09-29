"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DocumentTextIcon,
  UsersIcon,
  EnvelopeIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

function fmtNum(n) {
  return new Intl.NumberFormat("id-ID").format(n || 0);
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function fmtDateTime(d) {
  return new Date(d).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

const STATUS_LABEL = { DRAFT: "Draft", PENDING: "Menunggu", PUBLISHED: "Terbit" };
const STATUS_CLASS = {
  DRAFT: "bg-gray-100 text-gray-600",
  PENDING: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700"
};

function StatCard({ label, value, icon: Icon, accent, subtext, href }) {
  const inner = (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
        <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900">{fmtNum(value)}</p>
        {subtext ? <p className="mt-1 text-xs text-gray-500">{subtext}</p> : null}
      </div>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
      >
        {inner}
      </Link>
    );
  }
  return <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">{inner}</div>;
}

function VisitsChart({ data }) {
  const [mode, setMode] = useState("views");
  const W = 920;
  const H = 260;
  const PAD = { l: 44, r: 16, t: 16, b: 28 };
  const values = data.map((d) => d[mode]);
  const max = Math.max(1, ...values);
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const stepX = data.length > 1 ? iw / (data.length - 1) : iw;
  const points = data.map((d, i) => [PAD.l + i * stepX, PAD.t + ih - (d[mode] / max) * ih]);
  const line = points.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${(PAD.l + iw).toFixed(1)},${PAD.t + ih} L${PAD.l},${PAD.t + ih} Z`;
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Kunjungan 30 hari</h3>
          <p className="text-xs text-gray-500">Ringkasan trafik situs</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1 text-xs font-medium">
          {[
            ["views", "Kunjungan"],
            ["visitors", "Pengunjung"]
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`rounded-md px-3 py-1 ${
                mode === key ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Grafik kunjungan">
        {ticks.map((t, i) => {
          const y = PAD.t + ih - (t / max) * ih;
          return (
            <g key={`tick-${i}`}>
              <line x1={PAD.l} x2={PAD.l + iw} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" />
              <text x={PAD.l - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
                {t}
              </text>
            </g>
          );
        })}
        {data.map((d, i) =>
          i % 5 === 0 || i === data.length - 1 ? (
            <text
              key={d.date}
              x={PAD.l + i * stepX}
              y={H - 6}
              textAnchor="middle"
              fontSize="11"
              fill="#9ca3af"
            >
              {fmtDate(d.date)}
            </text>
          ) : null
        )}
        <defs>
          <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#gradViews)" />
        <path d={line} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

function QuickLinks({ isAdmin, stats }) {
  const links = [
    { href: "/admin/posts/new", label: "Tulis artikel", desc: "Buat artikel baru" },
    { href: "/admin/events/new", label: "Buat event", desc: "Jadwalkan kegiatan" },
    { href: "/admin/galeri", label: "Galeri", desc: "Kelola foto & video" }
  ];
  if (isAdmin) {
    links.push(
      { href: "/admin/registration", label: "Pendaftaran", desc: `${fmtNum(stats.newRegistrations)} baru` },
      { href: "/admin/message", label: "Pesan masuk", desc: `${fmtNum(stats.unreadMessages)} belum dibaca` }
    );
  }
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-1 text-base font-semibold text-gray-900">Aksi cepat</h3>
      <p className="mb-4 text-xs text-gray-500">Navigasi ke halaman yang sering dipakai</p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5 text-sm transition hover:border-blue-200 hover:bg-blue-50/50"
            >
              <span className="font-medium text-gray-800">{l.label}</span>
              <span className="text-xs text-gray-400">{l.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecentPosts({ items }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Artikel terbaru</h3>
          <p className="text-xs text-gray-500">Status dan pembaruan terakhir</p>
        </div>
        <Link href="/admin/posts" className="text-xs font-medium text-blue-600 hover:underline">
          Lihat semua
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
              <th className="pb-2 pr-3">Judul</th>
              <th className="pb-2 pr-3">Penulis</th>
              <th className="pb-2 pr-3">Status</th>
              <th className="pb-2">Diperbarui</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  Belum ada artikel.
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80">
                  <td className="py-3 pr-3">
                    <Link href={`/admin/posts/${p.id}`} className="font-medium text-blue-700 hover:underline">
                      {p.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-3 text-gray-600">{p.author?.name}</td>
                  <td className="py-3 pr-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[p.status]}`}>
                      {STATUS_LABEL[p.status]}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">{fmtDateTime(p.updatedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Gagal memuat"))))
      .then(setData)
      .catch(() => setError("Gagal memuat data dashboard."));
  }, []);

  if (error) return <p className="p-4 text-sm text-red-600">{error}</p>;
  if (!data) return <p className="p-4 text-sm text-gray-500">Memuat dashboard…</p>;

  const s = data.stats;
  const isAdmin = data.role === "ADMIN";
  const topStats = [
    {
      label: "Hari ini",
      value: s.viewsToday,
      icon: EyeIcon,
      accent: "bg-blue-600",
      subtext: "Kunjungan"
    },
    {
      label: "7 hari",
      value: s.views7d,
      icon: ArrowTrendingUpIcon,
      accent: "bg-sky-500",
      subtext: "Kunjungan"
    },
    {
      label: "Artikel",
      value: s.publishedPosts,
      icon: DocumentTextIcon,
      accent: "bg-emerald-600",
      subtext: `${fmtNum(s.pendingPosts)} menunggu`,
      href: "/admin/posts"
    },
    {
      label: "Event",
      value: s.upcomingEvents,
      icon: CalendarIcon,
      accent: "bg-amber-500",
      subtext: "Mendatang",
      href: "/admin/events"
    }
  ];
  if (isAdmin) {
    topStats.push(
      {
        label: "Pendaftar",
        value: s.newRegistrations,
        icon: UsersIcon,
        accent: "bg-indigo-600",
        subtext: "Status baru",
        href: "/admin/registration"
      },
      {
        label: "Pesan",
        value: s.unreadMessages,
        icon: EnvelopeIcon,
        accent: "bg-rose-500",
        subtext: "Belum dibaca",
        href: "/admin/message"
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Halo, {data.name}</h1>
          <p className="mt-0.5 text-sm text-gray-500">Ringkasan aktivitas website CKS.</p>
        </div>
        <Link href="/admin/posts/new" className="ck-btn-primary">
          + Tulis Artikel
        </Link>
      </div>

      <div
        className={`grid gap-3 ${isAdmin ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" : "sm:grid-cols-2 lg:grid-cols-4"}`}
      >
        {topStats.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VisitsChart data={data.chart} />
        </div>
        <QuickLinks isAdmin={isAdmin} stats={s} />
      </div>

      <RecentPosts items={data.recentPosts} />
    </div>
  );
}
