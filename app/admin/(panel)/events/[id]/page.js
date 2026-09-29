import { notFound } from "next/navigation";
import { MainLayout } from "@premieroctet/next-admin/adapters/next";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { adminLayoutProps, adminUserProp } from "@/lib/admin-layout";
import EventEditor from "@/components/admin/EventEditor";

export const dynamic = "force-dynamic";

export default async function EventEditPage({ params }) {
  const { id } = await params;
  const user = await getSessionUser();

  let event = null;
  if (id !== "new") {
    event = await prisma.event.findUnique({ where: { id: Number(id) } });
    if (!event) notFound();
  }

  const layoutProps = await adminLayoutProps(user);

  return (
    <MainLayout {...layoutProps} user={adminUserProp(user)}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{event ? "Edit Event" : "Event Baru"}</h1>
        <p className="text-sm text-gray-500">
          {event
            ? `Terakhir diubah ${new Date(event.updatedAt).toLocaleString("id-ID")}`
            : "Isi detail event, publikasikan, dan tampilkan di halaman publik."}
        </p>
      </div>
      <EventEditor event={event} />
    </MainLayout>
  );
}
