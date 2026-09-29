import { createHandler } from "@premieroctet/next-admin/appHandler";
import { prisma } from "@/lib/prisma";
import { buildAdminOptions } from "@/lib/admin-options";
import { getSessionUserFromRequest } from "@/lib/auth";

const AUTHOR_ALLOWED_RESOURCES = new Set(["category", "tag"]);

function createRunner(role) {
  const { run } = createHandler({
    apiBasePath: "/api/admin",
    prisma,
    options: buildAdminOptions({ role }),
    onRequest: async (req) => {
      const session = await getSessionUserFromRequest(req);
      if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (session.role !== "ADMIN") {
        const seg = req.url
          .split("/api/admin/")[1]
          ?.split(/[/?]/)[0]
          ?.toLowerCase();
        if (req.method !== "GET" || !AUTHOR_ALLOWED_RESOURCES.has(seg || "")) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }
  });
  return run;
}

const runAdmin = createRunner("ADMIN");
const runAuthor = createRunner("AUTHOR");

async function dispatch(request, ctx) {
  const session = await getSessionUserFromRequest(request);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const run = session.role === "ADMIN" ? runAdmin : runAuthor;
  return run(request, ctx);
}

export { dispatch as GET, dispatch as POST, dispatch as DELETE };
