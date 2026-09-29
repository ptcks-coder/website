import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "cks_admin_session";
const LOGIN_PATH = "/admin/login";

function getSecret() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET || "cks-dev-insecure-secret"
  );
}

async function readSession(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload?.sub ? payload : null;
  } catch {
    return null;
  }
}

function rewriteAdminPath(pathname) {
  const lower = pathname.toLowerCase();
  // Redirect model NextAdmin ke custom pages.
  const postMatch = lower.match(/^\/admin\/post(?:\/(.*))?$/);
  if (postMatch) {
    const rest = postMatch[1] || "";
    return `/admin/posts${rest ? "/" + rest : ""}`;
  }
  const eventMatch = lower.match(/^\/admin\/event(?:\/(.*))?$/);
  if (eventMatch) {
    const rest = eventMatch[1] || "";
    return `/admin/events${rest ? "/" + rest : ""}`;
  }
  if (lower === "/admin/galleryitem" || lower === "/admin/galleryitems") {
    return "/admin/galeri";
  }
  return null;
}

export async function middleware(request) {
  let { pathname } = request.nextUrl;

  const rewritten = rewriteAdminPath(pathname);
  if (rewritten) {
    return NextResponse.redirect(new URL(rewritten, request.url));
  }

  const session = await readSession(request);

  // Halaman login: jika sudah masuk, lempar ke dashboard admin.
  if (pathname === LOGIN_PATH) {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // API admin lain
  if (pathname.startsWith("/api/admin")) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Halaman admin lain
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const url = new URL(LOGIN_PATH, request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
