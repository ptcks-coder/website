import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const NEGARA = new Set(["Belum ditentukan", "Taiwan", "Hong Kong", "Malaysia", "Singapura"]);

function validate(body) {
  const errors = {};
  const get = (k) => String(body?.[k] || "").trim();

  if (!get("nama")) errors.nama = "Nama wajib diisi.";
  const nik = get("nik");
  if (!nik) errors.nik = "NIK wajib diisi.";
  else if (!/^\d{16}$/.test(nik)) errors.nik = "NIK harus 16 digit angka.";

  const telepon = get("telepon");
  if (!telepon) errors.telepon = "Telepon wajib diisi.";
  else if (!/^08\d{8,11}$/.test(telepon) && !/^\+62\d{9,13}$/.test(telepon)) {
    errors.telepon = "Telepon harus diawali 08 atau +62.";
  }

  const email = get("email");
  if (!email) errors.email = "Email wajib diisi.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Format email tidak valid.";

  if (!get("jenisKelamin")) errors.jenisKelamin = "Pilih jenis kelamin.";
  if (!get("pendidikan")) errors.pendidikan = "Pilih pendidikan.";
  if (!NEGARA.has(get("negaraTujuan"))) errors.negaraTujuan = "Pilih negara tujuan dari daftar.";
  if (!get("kabKota")) errors.kabKota = "Kabupaten/kota wajib diisi.";

  return errors;
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ success: false, error: "Payload tidak valid." }, { status: 400 });
  }

  const errors = validate(body);
  if (Object.keys(errors).length) {
    return NextResponse.json(
      { success: false, error: "Periksa kembali isian formulir.", errors },
      { status: 422 }
    );
  }

  const get = (k) => String(body[k] || "").trim();
  const nomor = `CKS-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;

  try {
    const reg = await prisma.registration.create({
      data: {
        nomor,
        nama: get("nama").slice(0, 150),
        nik: get("nik"),
        telepon: get("telepon").slice(0, 20),
        email: get("email").toLowerCase().slice(0, 150),
        jenisKelamin: get("jenisKelamin"),
        pendidikan: get("pendidikan"),
        negaraTujuan: get("negaraTujuan"),
        kabKota: get("kabKota").slice(0, 100),
        catatan: get("catatan").slice(0, 1000) || null,
        status: "BARU"
      }
    });

    return NextResponse.json({
      success: true,
      data: { nomorPendaftaran: reg.nomor, status: "menunggu" }
    });
  } catch (error) {
    console.error("pendaftaran error:", error);
    return NextResponse.json(
      { success: false, error: "Server sedang bermasalah. Coba lagi nanti." },
      { status: 500 }
    );
  }
}
