import { getSessionUser } from "@/lib/auth";
import EventsTable from "@/components/admin/EventsTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const user = await getSessionUser();

  return (
    <>
      <AdminPageHeader
        title="Event & Kegiatan"
        description="Kelola jadwal sosialisasi, kelas, dan kegiatan CKS."
      />
      <EventsTable role={user.role} />
    </>
  );
}
