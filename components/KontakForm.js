"use client";

import { useMemo, useState } from "react";

const INITIAL = { nama: "", telepon: "", email: "", pesan: "" };

function validate(form) {
  const errors = {};
  if (!form.nama.trim()) errors.nama = "Nama wajib diisi.";
  if (!form.telepon.trim()) errors.telepon = "Telepon wajib diisi.";
  else if (!/^0\d{9,13}$/.test(form.telepon.trim()) && !/^\+62\d{9,13}$/.test(form.telepon.trim())) {
    errors.telepon = "Telepon harus diawali 0 atau +62.";
  }
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Format email tidak valid.";
  }
  if (!form.pesan.trim()) errors.pesan = "Pesan wajib diisi.";
  else if (form.pesan.trim().length < 10) {
    errors.pesan = "Pesan minimal 10 karakter.";
  }
  return errors;
}

export default function KontakForm() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
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
      const res = await fetch("/api/pesan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: form.nama.trim(),
          telepon: form.telepon.trim(),
          email: form.email.trim(),
          pesan: form.pesan.trim()
        })
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.success) {
        if (payload?.errors) setErrors(payload.errors);
        setSubmitError(payload?.error || "Pesan gagal dikirim. Coba lagi.");
        return;
      }
      setForm(INITIAL);
      setDone(true);
    } catch {
      setSubmitError("Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-panel" onSubmit={onSubmit} noValidate>
      <div className="form-panel-head">
        <h2>Kirim pesan</h2>
        <p>Pesan diteruskan ke tim CKS — kami akan menghubungi Anda melalui telepon/WA.</p>
      </div>

      {done ? (
        <p className="form-success" role="status">
          Pesan berhasil terkirim. Terima kasih — petugas akan segera menindaklanjuti.
        </p>
      ) : null}
      {submitError ? <p className="error">{submitError}</p> : null}

      <div className="form-grid">
        <label className="field">
          <span>
            Nama <span className="req">*</span>
          </span>
          <input
            name="nama"
            type="text"
            autoComplete="name"
            value={form.nama}
            onChange={onChange}
            disabled={submitting}
            aria-invalid={Boolean(errors.nama)}
          />
          {errors.nama ? <span className="error">{errors.nama}</span> : null}
        </label>

        <label className="field">
          <span>
            Telepon / WhatsApp <span className="req">*</span>
          </span>
          <input
            name="telepon"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="08…"
            value={form.telepon}
            onChange={onChange}
            disabled={submitting}
            aria-invalid={Boolean(errors.telepon)}
          />
          {errors.telepon ? <span className="error">{errors.telepon}</span> : null}
        </label>

        <label className="field full">
          <span>Email (opsional)</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={onChange}
            disabled={submitting}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <span className="error">{errors.email}</span> : null}
        </label>

        <label className="field full">
          <span>
            Pesan <span className="req">*</span>
          </span>
          <textarea
            name="pesan"
            rows={5}
            value={form.pesan}
            onChange={onChange}
            disabled={submitting}
            aria-invalid={Boolean(errors.pesan)}
          />
          {errors.pesan ? <span className="error">{errors.pesan}</span> : null}
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={!canSubmit || submitting}>
          {submitting ? "Mengirim…" : "Kirim pesan"}
        </button>
      </div>
    </form>
  );
}
