import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const category = searchParams.get("category")?.trim();
  const mediaType = searchParams.get("mediaType")?.trim();
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(48, Math.max(1, Number(searchParams.get("pageSize") || 12)));
  const skip = (page - 1) * pageSize;

  const where = {};
  if (q) where.OR = [{ title: { contains: q } }, { caption: { contains: q } }];
  if (category) where.category = category;
  if (mediaType === "IMAGE" || mediaType === "VIDEO") where.mediaType = mediaType;

  const [items, total, categories] = await Promise.all([
    prisma.galleryItem.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        caption: true,
        image: true,
        mediaType: true,
        category: true,
        sortOrder: true,
        published: true,
        createdAt: true
      }
    }),
    prisma.galleryItem.count({ where }),
    prisma.galleryItem.groupBy({ by: ["category"], _count: true })
  ]);

  return NextResponse.json({ items, total, page, pageSize, categories });
}

export async function POST(request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const title = String(body.title || "").trim();
  const image = String(body.image || "").trim();
  if (!title) return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });
  if (!image) return NextResponse.json({ error: "File media wajib diunggah." }, { status: 400 });

  const mediaType = body.mediaType === "VIDEO" ? "VIDEO" : "IMAGE";

  const item = await prisma.galleryItem.create({
    data: {
      title,
      caption: String(body.caption || "").trim() || null,
      image,
      mediaType,
      category: String(body.category || "Kegiatan").trim() || "Kegiatan",
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      published: body.published === undefined ? true : body.published === true || body.published === "true"
    }
  });

  return NextResponse.json({ ok: true, id: item.id });
}
