import { MainLayout } from "@premieroctet/next-admin/adapters/next";
import { getSessionUser } from "@/lib/auth";
import { adminLayoutProps, adminUserProp } from "@/lib/admin-layout";
import GalleryGrid from "@/components/admin/GalleryGrid";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const user = await getSessionUser();
  const layoutProps = await adminLayoutProps(user);

  return (
    <MainLayout {...layoutProps} user={adminUserProp(user)}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Galeri Kegiatan</h1>
        <p className="text-sm text-gray-500">Kelola foto dan video short kegiatan CKS.</p>
      </div>
      <GalleryGrid role={user.role} />
    </MainLayout>
  );
}
