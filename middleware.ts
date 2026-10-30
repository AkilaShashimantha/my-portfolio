import { auth, ALLOWED_ADMIN_EMAIL } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userEmail = req.auth?.user?.email?.toLowerCase();
  const pathname = nextUrl.pathname;

  const isAdminPath = pathname.startsWith("/admin");
  const isApiAdminPath = pathname.startsWith("/api/admin");

  if (isAdminPath || isApiAdminPath) {
    // Allow access to login and unauthorized pages without loop
    if (pathname === "/admin/login" || pathname === "/admin/unauthorized") {
      if (isLoggedIn && userEmail === ALLOWED_ADMIN_EMAIL.toLowerCase() && pathname === "/admin/login") {
        return NextResponse.redirect(new URL("/admin", nextUrl.origin));
      }
      return NextResponse.next();
    }

    if (!isLoggedIn) {
      const loginUrl = new URL("/admin/login", nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userEmail !== ALLOWED_ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.redirect(new URL("/admin/unauthorized", nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
