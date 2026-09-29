import { notFound, redirect } from "next/navigation";
import { MainLayout } from "@premieroctet/next-admin/adapters/next";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { adminLayoutProps, adminUserProp } from "@/lib/admin-layout";
import PostEditor from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

export default async function PostEditPage({ params }) {
  const { id } = await params;
  const user = await getSessionUser();
  const layoutProps = await adminLayoutProps(user);

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

  return (
    <MainLayout {...layoutProps} user={adminUserProp(user)}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {post ? "Edit Artikel" : "Artikel Baru"}
        </h1>
        <p className="text-sm text-gray-500">
          {post
            ? `Terakhir diubah ${new Date(post.updatedAt).toLocaleString("id-ID")} oleh ${post.author?.name}`
            : "Tulis artikel, lalu simpan draft atau kirim untuk ditinjau."}
        </p>
      </div>
      <PostEditor post={post} categories={categories} tags={tags} role={user.role} />
    </MainLayout>
  );
}
