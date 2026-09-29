import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { docToHtml } from "@/lib/content";

export const dynamic = "force-dynamic";

async function uniqueSlug(slug, excludeId) {
  const base = slugify(slug) || `event-${Date.now()}`;
  let candidate = base;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const found = await prisma.event.findUnique({ where: { slug: candidate } });
    if (!found || found.id === excludeId) return candidate;
    i += 1;
    candidate = `${base}-${i}`;
  }
}

export async function GET(request, { params }) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id: Number(id) } });
  if (!event) return NextResponse.json({ error: "Event tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ event });
}

export async function PUT(request, { params }) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const eventId = Number(id);
  const existing = await prisma.event.findUnique({ where: { id: eventId } });
  if (!existing) return NextResponse.json({ error: "Event tidak ditemukan." }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });

  const slug = await uniqueSlug(body.slug || title, eventId);
  const longDescriptionJson =
    body.longDescriptionJson && typeof body.longDescriptionJson === "object"
      ? body.longDescriptionJson
      : existing.longDescriptionJson;
  const longDescriptionHtml = longDescriptionJson ? docToHtml(longDescriptionJson) : existing.longDescriptionHtml;

  const startAt = body.startAt ? new Date(body.startAt) : existing.startAt;
  const endAt = body.endAt ? new Date(body.endAt) : existing.endAt;

  const event = await prisma.event.update({
    where: { id: eventId },
    data: {
      title,
      slug,
      shortDescription: String(body.shortDescription || "").slice(0, 500) || null,
      longDescriptionJson,
      longDescriptionHtml,
      location: String(body.location || "").slice(0, 200) || null,
      startAt,
      endAt,
      image: body.image ?? existing.image,
      published: body.published === undefined ? existing.published : body.published === true || body.published === "true"
    }
  });
  return NextResponse.json({ ok: true, id: event.id, slug: event.slug });
}

export async function DELETE(request, { params }) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const eventId = Number(id);
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.event.delete({ where: { id: eventId } });
  return NextResponse.json({ ok: true });
}
