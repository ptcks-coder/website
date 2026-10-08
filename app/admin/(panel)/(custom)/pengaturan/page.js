import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (user.role !== "ADMIN") redirect("/admin");

  const settings = await getSettings();

  return (
    <>
      <AdminPageHeader
        title="Pengaturan"
        description="Identitas situs, kontak, media sosial, dan integrasi Google Analytics / Search Console."
      />
      <SettingsForm initial={settings} />
    </>
  );
}
