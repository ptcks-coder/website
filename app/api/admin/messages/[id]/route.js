import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(request, { params }) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const messageId = Number(id);
  const existing = await prisma.message.findUnique({ where: { id: messageId } });
  if (!existing) {
    return NextResponse.json({ error: "Pesan tidak ditemukan." }, { status: 404 });
  }

  await prisma.message.delete({ where: { id: messageId } });
  return NextResponse.json({ ok: true });
}
