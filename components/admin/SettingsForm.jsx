"use client";

import { useState } from "react";

function TextField({ label, value, onChange, textarea, hint, placeholder }) {
  return (
    <div>
      <label className="ck-label">{label}</label>
      {textarea ? (
        <textarea
          className="ck-input"
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="ck-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {hint ? <p className="mt-1 text-xs text-gray-400">{hint}</p> : null}
    </div>
  );
}

function Section({ title, desc, children }) {
  return (
    <div className="ck-card">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {desc ? <p className="mb-4 mt-0.5 text-xs text-gray-400">{desc}</p> : <div className="mb-4" />}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function SettingsForm({ initial }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setMessage({ type: "error", text: d.error || "Gagal menyimpan." });
        return;
      }
      setMessage({ type: "ok", text: "Pengaturan tersimpan." });
    } catch {
      setMessage({ type: "error", text: "Tidak dapat menghubungi server." });
    } finally {
      setSaving(false);
    }
  }

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

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Umum" desc="Identitas situs yang tampil di judul halaman dan hasil pencarian.">
          <TextField label="Judul situs" value={form.siteTitle} onChange={set("siteTitle")} />
          <TextField label="Tagline" value={form.tagline} onChange={set("tagline")} />
          <TextField
            label="Deskripsi meta default"
            value={form.metaDescription}
            onChange={set("metaDescription")}
            textarea
            hint="Dipakai sebagai meta description situs bila halaman tidak punya deskripsi sendiri."
          />
        </Section>

        <Section title="Kontak & Kantor" desc="Ditampilkan di halaman Kontak dan footer situs.">
          <TextField label="Alamat kantor" value={form.address} onChange={set("address")} textarea />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Telepon kantor" value={form.phone} onChange={set("phone")} />
            <TextField
              label="WhatsApp"
              value={form.whatsapp}
              onChange={set("whatsapp")}
              placeholder="628…"
            />
          </div>
          <TextField label="Email" value={form.email} onChange={set("email")} />
          <TextField label="Jam kerja" value={form.workHours} onChange={set("workHours")} />
          <TextField
            label="URL embed Google Maps"
            value={form.mapsEmbedUrl}
            onChange={set("mapsEmbedUrl")}
            hint='Dari Google Maps: Bagikan → Sematkan peta → salin URL di atribut src iframe.'
          />
        </Section>

        <Section title="Media Sosial" desc="Tautan akun resmi — kosongkan yang tidak dipakai.">
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Facebook" value={form.facebook} onChange={set("facebook")} />
            <TextField label="Instagram" value={form.instagram} onChange={set("instagram")} />
            <TextField label="TikTok" value={form.tiktok} onChange={set("tiktok")} />
            <TextField label="YouTube" value={form.youtube} onChange={set("youtube")} />
          </div>
        </Section>

        <Section
          title="Integrasi & SEO"
          desc="Hubungkan situs dengan layanan analitik dan verifikasi mesin pencari."
        >
          <TextField
            label="Google Analytics — Measurement ID"
            value={form.gaMeasurementId}
            onChange={set("gaMeasurementId")}
            placeholder="G-XXXXXXXXXX"
            hint="Script gtag.js otomatis dipasang di semua halaman bila diisi."
          />
          <TextField
            label="Google Search Console — kode verifikasi"
            value={form.gscVerification}
            onChange={set("gscVerification")}
            placeholder="kode pada meta tag google-site-verification"
            hint='Isi bagian content="…" dari meta tag verifikasi Search Console.'
          />
          <div>
            <label className="ck-label">Indeks mesin pencari</label>
            <select
              className="ck-input"
              value={form.robotsIndex}
              onChange={(e) => set("robotsIndex")(e.target.value)}
            >
              <option value="1">Izinkan pengindeksan (index, follow)</option>
              <option value="0">Jangan indeks situs (noindex, nofollow)</option>
            </select>
          </div>
        </Section>
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <button type="button" onClick={save} disabled={saving} className="ck-btn-primary px-6">
          {saving ? "Menyimpan…" : "Simpan pengaturan"}
        </button>
      </div>
    </div>
  );
}
