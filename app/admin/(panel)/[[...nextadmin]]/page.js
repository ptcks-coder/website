import { redirect } from "next/navigation";
import { getNextAdminProps } from "@premieroctet/next-admin/appRouter";
import { NextAdmin } from "@premieroctet/next-admin/adapters/next";
import PageLoader from "@premieroctet/next-admin/pageLoader";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { buildAdminOptions } from "@/lib/admin-options";
import { logoutAction } from "@/lib/admin-actions";
import Dashboard from "@/components/admin/Dashboard";

function redirectCustomRoutes(nextadmin) {
  const first = nextadmin?.[0]?.toLowerCase();
  const rest = nextadmin?.slice(1) ?? [];
  if (first === "post") {
    const path = rest.length ? `/admin/posts/${rest.join("/")}` : "/admin/posts";
    redirect(path);
  }
  if (first === "event") {
    const path = rest.length ? `/admin/events/${rest.join("/")}` : "/admin/events";
    redirect(path);
  }
  if (first === "galleryitem" && rest.length === 0) {
    redirect("/admin/galeri");
  }
}

export default async function AdminPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const user = await getSessionUser();

  redirectCustomRoutes(params?.nextadmin);

  const adminProps = await getNextAdminProps({
    params: params?.nextadmin,
    searchParams,
    basePath: "/admin",
    apiBasePath: "/api/admin",
    prisma,
    options: buildAdminOptions(user)
  });

  return (
    <NextAdmin
      {...adminProps}
      dashboard={<Dashboard role={user.role} />}
      pageLoader={<PageLoader key="cks-page-loader" />}
      user={{
        data: { name: user.name, picture: undefined },
        logout: logoutAction
      }}
    />
  );
}
