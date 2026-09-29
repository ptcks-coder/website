import { MainLayout } from "@premieroctet/next-admin/adapters/next";
import { getSessionUser } from "@/lib/auth";
import { adminLayoutProps, adminUserProp } from "@/lib/admin-layout";
import PostsTable from "@/components/admin/PostsTable";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const user = await getSessionUser();
  const layoutProps = await adminLayoutProps(user);

  return (
    <MainLayout {...layoutProps} user={adminUserProp(user)}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Artikel</h1>
        <p className="text-sm text-gray-500">
          Kelola tulisan blog — draft, persetujuan, dan publikasi.
        </p>
      </div>
      <PostsTable role={user.role} />
    </MainLayout>
  );
}
