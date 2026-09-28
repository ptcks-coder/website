"use client";

import { useMemo, useState } from "react";

const INITIAL = {
  nama: "",
  nik: "",
  telepon: "",
  email: "",
  jenisKelamin: "",
  pendidikan: "",
  negaraTujuan: "",
  kabKota: "",
  catatan: ""
};

/** Opsi tujuan dari kartu lowongan situs + Belum ditentukan */
const NEGARA_TUJUAN_OPTIONS = [
  { value: "Belum ditentukan", label: "Belum ditentukan" },
  { value: "Taiwan", label: "Taiwan" },
  { value: "Hong Kong", label: "Hong Kong" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "Singapura", label: "Singapura" }
];

const NEGARA_TUJUAN_VALUES = new Set(NEGARA_TUJUAN_OPTIONS.map((o) => o.value));

const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_PJTKI_API_URL) ||
  "http://127.0.0.1:3004";

function isValidTelepon(raw) {
  const t = String(raw || "").trim();
  if (/^08\d{8,11}$/.test(t)) return true;
  if (/^\+62\d{9,13}$/.test(t)) return true;
  return false;
}

function validate(form) {
  const errors = {};
  if (!form.nama.trim()) errors.nama = "Nama wajib diisi.";

  const nik = form.nik.trim();
  if (!nik) errors.nik = "NIK wajib diisi.";
  else if (!/^\d{16}$/.test(nik)) errors.nik = "NIK harus 16 digit angka.";

  const telepon = form.telepon.trim();
  if (!telepon) errors.telepon = "Telepon wajib diisi.";
  else if (!isValidTelepon(telepon)) {
    errors.telepon = "Telepon harus diawali 08 atau +62.";
  }

  const email = form.email.trim();
  if (!email) errors.email = "Email wajib diisi.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Format email tidak valid.";
  }

  if (!form.jenisKelamin) errors.jenisKelamin = "Pilih jenis kelamin.";
  if (!form.pendidikan) errors.pendidikan = "Pilih pendidikan.";

  const negaraTujuan = form.negaraTujuan.trim();
  if (!negaraTujuan) errors.negaraTujuan = "Pilih negara tujuan.";
  else if (!NEGARA_TUJUAN_VALUES.has(negaraTujuan)) {
    errors.negaraTujuan = "Pilih negara tujuan dari daftar.";
  }

  if (!form.kabKota.trim()) errors.kabKota = "Kabupaten/kota wajib diisi.";
  return errors;
}

export default function DaftarForm() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => Object.keys(validate(form)).length === 0, [form]);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setSubmitError("");
  }

  async function onSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setSubmitError("");
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/pendaftaran-online`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: form.nama.trim(),
          nik: form.nik.trim(),
          telepon: form.telepon.trim(),
          email: form.email.trim(),
          jenisKelamin: form.jenisKelamin,
          pendidikan: form.pendidikan,
          negaraTujuan: form.negaraTujuan.trim(),
          kabKota: form.kabKota.trim(),
          catatan: form.catatan.trim()
        })
      });

      let payload = null;
      try {
        payload = await res.json();
      } catch (_) {
        payload = null;
      }

      if (!res.ok || !payload?.success) {
        if (payload?.errors && typeof payload.errors === "object") {
          setErrors(payload.errors);
        }
        setSubmitError(
          payload?.error ||
            `Pendaftaran gagal (kode ${res.status}). Coba lagi atau hubungi petugas CKS.`
        );
        return;
      }

      setResult({
        nomorPendaftaran: payload.data?.nomorPendaftaran || "",
        status: payload.data?.status || "menunggu"
      });
      setForm(INITIAL);
    } catch (_) {
      setSubmitError(
        "Tidak dapat menghubungi server CKS. Periksa koneksi lalu coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-panel">
      <div className="form-panel-head">
        <h2>Formulir pendaftaran</h2>
        <p>Lengkapi data pribadi dan minat penempatan. Semua kolom bertanda wajib harus diisi.</p>
      </div>

      {result ? (
        <div className="success-box" role="status">
          <strong>Pendaftaran berhasil dikirim.</strong>
          Nomor pendaftaran: <span className="success-nomor">{result.nomorPendaftaran}</span>.
          Status: menunggu tindak lanjut petugas CKS (belum masuk data TKI).
        </div>
      ) : null}

      {submitError ? (
        <div className="error-box" role="alert" style={{ marginBottom: "1rem" }}>
          {submitError}
        </div>
      ) : null}

      <form onSubmit={onSubmit} noValidate>
        <fieldset className="form-section">
          <legend>Data pribadi</legend>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="nama">
                Nama lengkap <span className="req" aria-label="wajib">*</span>
              </label>
              <input
                id="nama"
                name="nama"
                value={form.nama}
                onChange={onChange}
                autoComplete="name"
                required
                aria-required="true"
                disabled={submitting}
              />
              {errors.nama ? <span className="error">{errors.nama}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="nik">
                NIK <span className="req" aria-label="wajib">*</span>
              </label>
              <input
                id="nik"
                name="nik"
                inputMode="numeric"
                maxLength={16}
                value={form.nik}
                onChange={onChange}
                required
                aria-required="true"
                disabled={submitting}
              />
              {errors.nik ? <span className="error">{errors.nik}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="telepon">
                Telepon / WhatsApp <span className="req" aria-label="wajib">*</span>
              </label>
              <input
                id="telepon"
                name="telepon"
                inputMode="tel"
                value={form.telepon}
                onChange={onChange}
                placeholder="08xxxxxxxxxx atau +62…"
                required
                aria-required="true"
                disabled={submitting}
              />
              {errors.telepon ? <span className="error">{errors.telepon}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="email">
                Email <span className="req" aria-label="wajib">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                autoComplete="email"
                required
                aria-required="true"
                disabled={submitting}
              />
              {errors.email ? <span className="error">{errors.email}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="jenisKelamin">Jenis kelamin</label>
              <select
                id="jenisKelamin"
                name="jenisKelamin"
                value={form.jenisKelamin}
                onChange={onChange}
                disabled={submitting}
              >
                <option value="">Pilih</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              {errors.jenisKelamin ? <span className="error">{errors.jenisKelamin}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="pendidikan">Pendidikan</label>
              <select
                id="pendidikan"
                name="pendidikan"
                value={form.pendidikan}
                onChange={onChange}
                disabled={submitting}
              >
                <option value="">Pilih</option>
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
                <option value="SMA/SMK">SMA/SMK</option>
                <option value="D1/D2/D3">D1/D2/D3</option>
                <option value="S1">S1</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              {errors.pendidikan ? <span className="error">{errors.pendidikan}</span> : null}
            </div>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Minat penempatan</legend>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="negaraTujuan">
                Negara tujuan minat <span className="req" aria-label="wajib">*</span>
              </label>
              <select
                id="negaraTujuan"
                name="negaraTujuan"
                value={form.negaraTujuan}
                onChange={onChange}
                required
                aria-required="true"
                disabled={submitting}
              >
                <option value="">Pilih tujuan</option>
                {NEGARA_TUJUAN_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.negaraTujuan ? <span className="error">{errors.negaraTujuan}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="kabKota">Kabupaten / Kota</label>
              <input
                id="kabKota"
                name="kabKota"
                value={form.kabKota}
                onChange={onChange}
                disabled={submitting}
              />
              {errors.kabKota ? <span className="error">{errors.kabKota}</span> : null}
            </div>

            <div className="field full">
              <label htmlFor="catatan">Catatan (opsional)</label>
              <textarea
                id="catatan"
                name="catatan"
                rows={4}
                value={form.catatan}
                onChange={onChange}
                placeholder="Informasi tambahan yang ingin disampaikan"
                disabled={submitting}
              />
            </div>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Mengirim…" : "Kirim pendaftaran"}
          </button>
          {!canSubmit && !submitting ? (
            <span className="note" style={{ marginTop: 0 }}>
              Lengkapi data wajib sebelum mengirim.
            </span>
          ) : null}
        </div>
      </form>

      <p className="note">
        Data dikirim ke server CKS dan ditampung sebagai pendaftaran online (status menunggu).
        Belum otomatis menjadi data TKI. Tidak ada password yang diminta.
      </p>
    </div>
  );
}
