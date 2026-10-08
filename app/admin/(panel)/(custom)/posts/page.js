import { getSessionUser } from "@/lib/auth";
import PostsTable from "@/components/admin/PostsTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const user = await getSessionUser();

  return (
    <>
      <AdminPageHeader
        title="Artikel"
        description="Kelola tulisan blog — draft, persetujuan, dan publikasi."
      />
      <PostsTable role={user.role} />
    </>
  );
}
