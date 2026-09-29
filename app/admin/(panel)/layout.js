import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default async function PanelLayout({ children }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return children;
}
