import { getMainLayoutProps } from "@premieroctet/next-admin/appRouter";
import { buildAdminOptions } from "@/lib/admin-options";
import { logoutAction } from "@/lib/admin-actions";

/** Props MainLayout untuk halaman kustom di dalam shell admin. */
export async function adminLayoutProps(user) {
  return getMainLayoutProps({
    basePath: "/admin",
    apiBasePath: "/api/admin",
    options: buildAdminOptions(user)
  });
}

export function adminUserProp(user) {
  return {
    data: { name: user.name },
    logout: logoutAction
  };
}
