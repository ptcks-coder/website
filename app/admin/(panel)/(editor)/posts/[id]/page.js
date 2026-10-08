import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import PostEditor from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

export default async function PostEditPage({ params }) {
  const { id } = await params;
  const user = await getSessionUser();

  let post = null;
  if (id !== "new") {
    post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        author: { select: { id: true, name: true } },
        categories: { select: { id: true } },
        tags: { select: { id: true } }
      }
    });
    if (!post) notFound();
    // Penulis hanya boleh membuka artikel miliknya sendiri.
    if (user.role !== "ADMIN" && post.authorId !== user.id) redirect("/admin/posts");
  }

  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } })
  ]);

  return <PostEditor post={post} categories={categories} tags={tags} role={user.role} />;
}
