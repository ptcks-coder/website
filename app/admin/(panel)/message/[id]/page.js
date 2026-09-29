import { notFound } from "next/navigation";
import { MainLayout } from "@premieroctet/next-admin/adapters/next";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { adminLayoutProps, adminUserProp } from "@/lib/admin-layout";
import MessageDetail from "@/components/admin/MessageDetail";

export const dynamic = "force-dynamic";

export default async function MessageReadPage({ params }) {
  const { id } = await params;
  const user = await getSessionUser();
  const layoutProps = await adminLayoutProps(user);

  const messageId = Number(id);
  if (!Number.isFinite(messageId)) notFound();

  let message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) notFound();

  // Seperti email: otomatis tandai sudah dibaca saat dibuka.
  if (!message.isRead) {
    message = await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true }
    });
  }

  return (
    <MainLayout {...layoutProps} user={adminUserProp(user)}>
      <MessageDetail
        message={{
          id: message.id,
          nama: message.nama,
          email: message.email,
          telepon: message.telepon,
          pesan: message.pesan,
          isRead: message.isRead,
          createdAt: message.createdAt.toISOString()
        }}
      />
    </MainLayout>
  );
}
