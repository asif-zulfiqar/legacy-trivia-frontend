import { NextResponse, type NextRequest } from "next/server";

const AUTH_HINT_COOKIE = "lt_auth";

const PROTECTED_PREFIXES = ["/game"];
const AUTH_PREFIXES = [
  "/login",
  "/signup",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

function matches(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthed = req.cookies.get(AUTH_HINT_COOKIE)?.value === "1";

  if (matches(pathname, PROTECTED_PREFIXES) && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    if (pathname !== "/login") url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (matches(pathname, AUTH_PREFIXES) && isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/game";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/game/:path*",
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password/:path*",
    "/reset-password",
  ],
};
