"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

function formatTanggal(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short"
  });
}

export default function MessageDetail({ message }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  async function hapus() {
    if (!confirm("Hapus pesan ini? Tindakan tidak dapat dibatalkan.")) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/messages/${message.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Gagal menghapus pesan.");
        setDeleting(false);
        return;
      }
      router.push("/admin/message");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server.");
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/message" className="ck-btn-secondary">
          ← Kembali
        </Link>
        <button
          type="button"
          className="ck-btn-danger"
          disabled={deleting}
          onClick={hapus}
        >
          {deleting ? "Menghapus…" : "Hapus pesan"}
        </button>
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      ) : null}

      <article className="ck-card space-y-5">
        <header className="space-y-3 border-b border-gray-100 pb-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              {message.nama}
            </h1>
            <span
              className={`ck-badge ${
                message.isRead
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
              }`}
            >
              {message.isRead ? "Sudah dibaca" : "Belum dibaca"}
            </span>
          </div>
          <dl className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Email
              </dt>
              <dd>
                {message.email ? (
                  <a
                    href={`mailto:${message.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {message.email}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Telepon
              </dt>
              <dd>
                {message.telepon ? (
                  <a
                    href={`tel:${message.telepon}`}
                    className="text-blue-600 hover:underline"
                  >
                    {message.telepon}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Tanggal
              </dt>
              <dd>{formatTanggal(message.createdAt)}</dd>
            </div>
          </dl>
        </header>

        <div>
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
            Isi pesan
          </h2>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
            {message.pesan}
          </div>
        </div>
      </article>
    </div>
  );
}
