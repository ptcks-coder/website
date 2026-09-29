import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ success: false, error: "Payload tidak valid." }, { status: 400 });
  }

  const nama = String(body.nama || "").trim();
  const telepon = String(body.telepon || "").trim();
  const email = String(body.email || "").trim();
  const pesan = String(body.pesan || "").trim();

  const errors = {};
  if (!nama) errors.nama = "Nama wajib diisi.";
  if (!telepon) errors.telepon = "Telepon wajib diisi.";
  else if (!/^0\d{9,13}$/.test(telepon) && !/^\+62\d{9,13}$/.test(telepon)) {
    errors.telepon = "Format telepon tidak valid.";
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Format email tidak valid.";
  if (!pesan) errors.pesan = "Pesan wajib diisi.";
  else if (pesan.length < 10) errors.pesan = "Pesan minimal 10 karakter.";

  if (Object.keys(errors).length) {
    return NextResponse.json(
      { success: false, error: "Periksa kembali isian formulir.", errors },
      { status: 422 }
    );
  }

  try {
    await prisma.message.create({
      data: {
        nama: nama.slice(0, 150),
        telepon: telepon.slice(0, 20),
        email: email.slice(0, 150) || null,
        pesan: pesan.slice(0, 2000)
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("pesan error:", error);
    return NextResponse.json(
      { success: false, error: "Server sedang bermasalah. Coba lagi nanti." },
      { status: 500 }
    );
  }
}
