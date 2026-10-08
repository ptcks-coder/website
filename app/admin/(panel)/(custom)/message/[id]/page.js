import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MessageDetail from "@/components/admin/MessageDetail";

export const dynamic = "force-dynamic";

export default async function MessageReadPage({ params }) {
  const { id } = await params;

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
  );
}
