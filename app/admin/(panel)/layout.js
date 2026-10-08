import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AdminLinkInterceptor from "@/components/admin/AdminLinkInterceptor";

export default async function PanelLayout({ children }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return (
    <>
      <AdminLinkInterceptor />
      {children}
    </>
  );
}
