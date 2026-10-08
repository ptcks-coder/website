import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { docToHtml } from "@/lib/content";

export const dynamic = "force-dynamic";

async function loadPost(id) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true } },
      categories: { select: { id: true } },
      tags: { select: { id: true } }
    }
  });
}

function statusFromAction(action, role, current) {
  if (action === "publish" && role === "ADMIN") return "PUBLISHED";
  if (action === "unpublish" && role === "ADMIN") return "DRAFT";
  if (action === "submit") return "PENDING";
  if (action === "draft") return "DRAFT";
  return current;
}

async function uniqueSlug(slug, excludeId) {
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

export async function GET(request, { params }) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const post = await loadPost(Number(id));
  if (!post) return NextResponse.json({ error: "Artikel tidak ditemukan." }, { status: 404 });
  if (user.role !== "ADMIN" && post.authorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ post });
}

export async function PUT(request, { params }) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const postId = Number(id);
  const existing = await prisma.post.findUnique({ where: { id: postId } });
  if (!existing) return NextResponse.json({ error: "Artikel tidak ditemukan." }, { status: 404 });

  const isAdmin = user.role === "ADMIN";
  if (!isAdmin && existing.authorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });

  const status = statusFromAction(body.action, user.role, existing.status);
  // Penulis tidak boleh menerbitkan — paksa menunggu persetujuan.
  const finalStatus = !isAdmin && status === "PUBLISHED" ? "PENDING" : status;

  const slug = await uniqueSlug(body.slug || title, postId);
  const contentJson =
    body.contentJson && typeof body.contentJson === "object" ? body.contentJson : existing.contentJson;
  const contentHtml =
    typeof body.contentHtml === "string" && body.contentHtml.trim()
      ? body.contentHtml
      : contentJson
        ? docToHtml(contentJson)
        : existing.contentHtml;

  const wasPublished = existing.status === "PUBLISHED";
  const publishedAt =
    finalStatus === "PUBLISHED" ? existing.publishedAt || new Date() : wasPublished ? existing.publishedAt : null;

  const post = await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      slug,
      excerpt: String(body.excerpt || "").slice(0, 500) || null,
      contentJson,
      contentHtml,
      featuredImage: "featuredImage" in body ? body.featuredImage || null : existing.featuredImage,
      status: finalStatus,
      seoTitle: "seoTitle" in body ? body.seoTitle || null : existing.seoTitle,
      seoDescription:
        "seoDescription" in body ? body.seoDescription || null : existing.seoDescription,
      focusKeyword: "focusKeyword" in body ? body.focusKeyword || null : existing.focusKeyword,
      publishedAt,
      categories: { set: (body.categoryIds || []).map((cid) => ({ id: Number(cid) })) },
      tags: { set: (body.tagIds || []).map((tid) => ({ id: Number(tid) })) }
    }
  });

  return NextResponse.json({ ok: true, id: post.id, slug: post.slug, status: post.status });
}

export async function DELETE(request, { params }) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const postId = Number(id);
  const existing = await prisma.post.findUnique({ where: { id: postId } });
  if (!existing) return NextResponse.json({ error: "Artikel tidak ditemukan." }, { status: 404 });

  const isAdmin = user.role === "ADMIN";
  const canDelete = isAdmin || (existing.authorId === user.id && existing.status !== "PUBLISHED");
  if (!canDelete) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.post.delete({ where: { id: postId } });
  return NextResponse.json({ ok: true });
}
