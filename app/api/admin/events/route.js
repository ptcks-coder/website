import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { docToHtml } from "@/lib/content";

export const dynamic = "force-dynamic";

async function uniqueSlug(slug, excludeId = null) {
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

export async function GET(request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const status = searchParams.get("status");

  const where = {};
  if (q) where.title = { contains: q };
  if (status === "published") where.published = true;
  if (status === "draft") where.published = false;

  const events = await prisma.event.findMany({
    where,
    orderBy: { startAt: "desc" },
    select: { id: true, title: true, slug: true, location: true, startAt: true, endAt: true, published: true, createdAt: true }
  });
  const counts = await prisma.event.groupBy({
    by: ["published"],
    _count: true
  });
  return NextResponse.json({ events, counts });
}

export async function POST(request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });

  const slug = await uniqueSlug(body.slug || title);
  const startAt = body.startAt ? new Date(body.startAt) : new Date();
  const endAt = body.endAt ? new Date(body.endAt) : null;
  const longDescriptionJson = body.longDescriptionJson && typeof body.longDescriptionJson === "object" ? body.longDescriptionJson : null;
  const longDescriptionHtml =
    typeof body.longDescriptionHtml === "string" && body.longDescriptionHtml.trim()
      ? body.longDescriptionHtml
      : longDescriptionJson
        ? docToHtml(longDescriptionJson)
        : "";

  const event = await prisma.event.create({
    data: {
      title,
      slug,
      shortDescription: String(body.shortDescription || "").slice(0, 500) || null,
      longDescriptionJson,
      longDescriptionHtml,
      location: String(body.location || "").slice(0, 200) || null,
      startAt,
      endAt,
      image: body.image || null,
      published: body.published === true || body.published === "true"
    }
  });
  return NextResponse.json({ ok: true, id: event.id, slug: event.slug });
}
