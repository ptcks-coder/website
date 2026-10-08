import { getSessionUser } from "@/lib/auth";
import GalleryGrid from "@/components/admin/GalleryGrid";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const user = await getSessionUser();

  return (
    <>
      <AdminPageHeader
        title="Galeri Kegiatan"
        description="Kelola foto dan video short kegiatan CKS."
      />
      <GalleryGrid role={user.role} />
    </>
  );
}
