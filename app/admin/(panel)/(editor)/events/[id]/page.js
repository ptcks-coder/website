import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventEditor from "@/components/admin/EventEditor";

export const dynamic = "force-dynamic";

export default async function EventEditPage({ params }) {
  const { id } = await params;

  let event = null;
  if (id !== "new") {
    event = await prisma.event.findUnique({ where: { id: Number(id) } });
    if (!event) notFound();
  }

  return <EventEditor event={event} />;
}
