import { redirect } from "next/navigation";
import { MainLayout } from "@premieroctet/next-admin/adapters/next";
import { getSessionUser } from "@/lib/auth";
import { adminLayoutProps, adminUserProp } from "@/lib/admin-layout";
import { getSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (user.role !== "ADMIN") redirect("/admin");

  const layoutProps = await adminLayoutProps(user);
  const settings = await getSettings();

  return (
    <MainLayout {...layoutProps} user={adminUserProp(user)}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-sm text-gray-500">
          Identitas situs, kontak, media sosial, dan integrasi Google Analytics / Search Console.
        </p>
      </div>
      <SettingsForm initial={settings} />
    </MainLayout>
  );
}
