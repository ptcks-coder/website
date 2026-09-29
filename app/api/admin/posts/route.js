import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { docToHtml } from "@/lib/content";

export const dynamic = "force-dynamic";

function statusFromAction(action, role) {
  if (action === "publish" && role === "ADMIN") return "PUBLISHED";
  if (action === "submit") return "PENDING";
  return "DRAFT";
}

async function uniqueSlug(slug, excludeId = null) {
  const base = slugify(slug) || `artikel-${Date.now()}`;
  let candidate = base;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const found = await prisma.post.findUnique({ where: { slug: candidate } });
    if (!found || found.id === excludeId) return candidate;
    i += 1;
    candidate = `${base}-${i}`;
  }
}

export async function GET(request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim();

  const where = {};
  if (status && ["DRAFT", "PENDING", "PUBLISHED"].includes(status)) where.status = status;
  if (q) where.title = { contains: q };
  if (user.role !== "ADMIN") where.authorId = user.id;

  const posts = await prisma.post.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      updatedAt: true,
      publishedAt: true,
      author: { select: { name: true } },
      categories: { select: { name: true } }
    }
  });

  const counts = await prisma.post.groupBy({
    by: ["status"],
    where: user.role === "ADMIN" ? {} : { authorId: user.id },
    _count: true
  });

  return NextResponse.json({ posts, counts });
}

export async function POST(request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const title = String(body.title || "").trim();
  if (!title) {
    return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });
  }

  const status = statusFromAction(body.action, user.role);
  const slug = await uniqueSlug(body.slug || title);
  const contentJson = body.contentJson && typeof body.contentJson === "object" ? body.contentJson : null;
  const contentHtml = contentJson ? docToHtml(contentJson) : "";

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: String(body.excerpt || "").slice(0, 500) || null,
      contentJson,
      contentHtml,
      featuredImage: body.featuredImage || null,
      status,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
      focusKeyword: body.focusKeyword || null,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      authorId: user.id,
      categories: { set: (body.categoryIds || []).map((id) => ({ id: Number(id) })) },
      tags: { set: (body.tagIds || []).map((id) => ({ id: Number(id) })) }
    }
  });

  return NextResponse.json({ ok: true, id: post.id, slug: post.slug });
}
