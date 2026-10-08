import { MainLayout } from "@premieroctet/next-admin/adapters/next";
import { getSessionUser } from "@/lib/auth";
import { adminLayoutProps, adminUserProp } from "@/lib/admin-layout";

export const dynamic = "force-dynamic";

/**
 * Shell admin (sidebar + header) dibagi untuk semua halaman kustom.
 * Diletakkan di layout — bukan di tiap halaman — supaya tidak di-compile
 * dan di-render ulang setiap kali berpindah halaman admin.
 */
export default async function CustomAdminLayout({ children }) {
  const user = await getSessionUser();
  const layoutProps = await adminLayoutProps(user);

  return (
    <MainLayout {...layoutProps} user={adminUserProp(user)}>
      {children}
    </MainLayout>
  );
}
