import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function clientIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "";
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = String(body?.path || "/").slice(0, 500);
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true });
    }
    const referrer = String(body?.referrer || "").slice(0, 500) || null;
    const ua = (request.headers.get("user-agent") || "").slice(0, 500);
    const day = new Date().toISOString().slice(0, 10);
    const visitor = crypto
      .createHash("sha256")
      .update(`${clientIp(request)}|${ua}|${day}`)
      .digest("hex")
      .slice(0, 32);

    await prisma.pageView.create({
      data: { path, referrer, userAgent: ua || null, visitor }
    });
  } catch (error) {
    console.error("track error:", error);
  }
  return NextResponse.json({ ok: true });
}
