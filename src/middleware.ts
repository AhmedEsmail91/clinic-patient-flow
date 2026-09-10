import { NextRequest, NextResponse } from "next/server";
import { PROTECTED_PATHS } from "@/constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  if (!isProtected) return NextResponse.next();

  // The auth token is httpOnly and JWT-signed by the Backend; middleware only
  // checks for its presence as a fast redirect, it never reads/decodes it.
  // The real auth check still happens client-side via /api/auth/me, since a
  // present-but-expired cookie can't be told apart here.
  const hasToken = request.cookies.has("token");
  if (hasToken) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/appointment/:path*", "/myAppointments/:path*"],
};
