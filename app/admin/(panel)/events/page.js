import { MainLayout } from "@premieroctet/next-admin/adapters/next";
import { getSessionUser } from "@/lib/auth";
import { adminLayoutProps, adminUserProp } from "@/lib/admin-layout";
import EventsTable from "@/components/admin/EventsTable";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const user = await getSessionUser();
  const layoutProps = await adminLayoutProps(user);

  return (
    <MainLayout {...layoutProps} user={adminUserProp(user)}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Event & Kegiatan</h1>
        <p className="text-sm text-gray-500">Kelola jadwal sosialisasi, kelas, dan kegiatan CKS.</p>
      </div>
      <EventsTable role={user.role} />
    </MainLayout>
  );
}
