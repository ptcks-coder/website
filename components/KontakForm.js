"use client";

import { useMemo, useState } from "react";

const INITIAL = { nama: "", telepon: "", pesan: "" };
const STORAGE_KEY = "cks_kontak_pesan";

function validate(form) {
  const errors = {};
  if (!form.nama.trim()) errors.nama = "Nama wajib diisi.";
  if (!form.telepon.trim()) errors.telepon = "Telepon wajib diisi.";
  else if (!/^0\d{9,13}$/.test(form.telepon.trim())) {
    errors.telepon = "Telepon harus diawali 0 dan 10–14 digit.";
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

  const canSubmit = useMemo(() => Object.keys(validate(form)).length === 0, [form]);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setDone(false);
  }

  function onSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = {
      ...form,
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const list = Array.isArray(existing) ? existing : [];
      list.push(payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setForm(INITIAL);
      setDone(true);
    } catch {
      setErrors({ form: "Gagal menyimpan di perangkat ini." });
    }
  }

  return (
    <form className="form-panel" onSubmit={onSubmit} noValidate>
      <div className="form-panel-head">
        <h2>Kirim pesan</h2>
        <p>Pesan tersimpan sementara di browser Anda (localStorage), belum masuk ke server CKS.</p>
      </div>

      {done ? (
        <p className="form-success" role="status">
          Pesan tersimpan di perangkat ini. Kontak kantor belum dilengkapi — petugas belum menerima
          otomatis dari situs.
        </p>
      ) : null}
      {errors.form ? <p className="error">{errors.form}</p> : null}

      <div className="form-grid">
        <label className="field">
          <span>Nama</span>
          <input
            name="nama"
            type="text"
            autoComplete="name"
            value={form.nama}
            onChange={onChange}
            aria-invalid={Boolean(errors.nama)}
          />
          {errors.nama ? <span className="error">{errors.nama}</span> : null}
        </label>

        <label className="field">
          <span>Telepon</span>
          <input
            name="telepon"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="08…"
            value={form.telepon}
            onChange={onChange}
            aria-invalid={Boolean(errors.telepon)}
          />
          {errors.telepon ? <span className="error">{errors.telepon}</span> : null}
        </label>

        <label className="field full">
          <span>Pesan</span>
          <textarea
            name="pesan"
            rows={5}
            value={form.pesan}
            onChange={onChange}
            aria-invalid={Boolean(errors.pesan)}
          />
          {errors.pesan ? <span className="error">{errors.pesan}</span> : null}
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
          Simpan pesan
        </button>
      </div>
    </form>
  );
}
